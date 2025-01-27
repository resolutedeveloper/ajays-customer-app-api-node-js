const db = require("../models/index");

async function submitFeedBack(req, res) {
    try {
        const { UserDetail } = req;
        if (!UserDetail || !UserDetail.CustomerID) {
            return res.status(400).json({
                message: "Invalid token! Login again"
            })
        }
        const { ItemID, OrderID, feedBackComment, feedBackStars } = req.body;

        if (!ItemID || !OrderID) {
            return res.status(400).json({
                message: "Item id or Order id is missing"
            })
        }

        if (Array.isArray(ItemID)) {
            const toStoreData = ItemID.map((item) => ({
                CustomerID: UserDetail.CustomerID,
                ItemID: item,
                OrderID: OrderID,
                feedBackComment: feedBackComment,
                feedBackStars: feedBackStars,
                IsDeleted: false,
            }));

            await db.feedback.bulkCreate(toStoreData);

            return res.status(200).json({
                message: 'Success'
            });
        }

        await db.feedback.create({
            CustomerID: UserDetail.CustomerID,
            ItemID: ItemID,
            OrderID: OrderID,
            IsDeleted: false,
            feedBackStars: feedBackStars,
            feedBackComment: feedBackComment
        })
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

module.exports = { submitFeedBack };