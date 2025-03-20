const { db } = require("../models/index");
const { Op } = require("sequelize");
const moment = require("moment");

async function submitRating(req, res) {
    try {
        const { UserDetail } = req;
        if (!UserDetail || !UserDetail.CustomerID) {
            return res.status(400).json({
                message: "Invalid token! Login again"
            })
        }
        const { ItemID, OrderID, Remark, Rating, LocationID, locationRating } = req.body;

        if (!ItemID || !Array.isArray(ItemID) || !OrderID || !LocationID) {
            return res.status(400).json({
                message: "Item id or Order id or Location id is missing"
            })
        }
        const whereCondition = {};
        whereCondition["OrderID"] = OrderID;
        whereCondition["CustomerID"] = UserDetail.CustomerID;
        const oneMonthAgo = moment().subtract(1, 'months').format("YYYY-MM-DD");

        whereCondition["CreatedOn"] = { [Op.get]: oneMonthAgo };
        const isOrdered = await db.order.findOne({
            where: whereCondition
        });

        if (!isOrdered) {
            return res.status(404).json({
                message: "Order not found or expired the review date."
            })
        }
        delete whereCondition["CreatedOn"];

        whereCondition["ItemID"] = ItemID;

        const alreadyRated = await db.rating.findOne({
            where: whereCondition
        });

        if (alreadyRated) {
            return res.status(400).json({
                message: "This item is already rated from your side."
            });
        }

        if (ItemID.length > 0) {
            const toStoreData = ItemID.map((item) => ({
                CustomerID: UserDetail.CustomerID,
                ItemID: item,
                OrderID: OrderID,
                LocationID: LocationID,
                // Remark: Remark,
                Rating: item?.Rating,
                CreatedOn: Date.now()
            }));

            await db.rating.bulkCreate(toStoreData);
            await db.orderDetails.update({
                isRatingDone: true,
                OverallRating: locationRating ? locationRating : 0,
                Remark: Remark
            }, {
                where: {
                    // ItemID: { [Op.in]: ItemID },
                    OrderID: OrderID
                }
            });

            return res.status(200).json({
                message: 'Success'
            });
        }

        // await db.rating.create({
        //     CustomerID: UserDetail.CustomerID,
        //     ItemID: ItemID,
        //     OrderID: OrderID,
        //     LocationID: LocationID,
        //     Remark: Remark,
        //     Rating: Rating,
        //     CreatedOn: Date.now(),
        // });

        await db.orderDetails.update({
            isRatingDone: true,
            OverallRating: locationRating ? locationRating : 0,
            Remark: Remark
        }, {
            where: {
                // ItemID: ItemID,
                OrderID: OrderID
            }
        });

        return res.status(200).json({
            message: 'Success'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error'
        });
    }
}


module.exports = { submitRating };