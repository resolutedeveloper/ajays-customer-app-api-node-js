const { db } = require("../models/index.js");
const { promotionBanner } = require("../utils/promotionData.js");

async function DashboardData(req, res) {
    try {
        const { LocationId } = req.query;
        if (!LocationId) {
            return res.status(404).json({
                message: "Location not found"
            })
        }

        // GET DATA FOR ITEM & CATEGORIES IN COMBINED FORM

        // const catAllocation = await db.sequelize.query(`
        //     SELECT 
        //         CategoryAllocations.ID, 
        //         CategoryAllocations.LocationID,
        //         Category.*,
        //         Item.*  -- Selecting columns from the Items table
        //     FROM CategoryAllocations 
        //     LEFT OUTER JOIN Categories AS Category 
        //         ON CategoryAllocations.CategoryID = Category.CategoryID
        //     LEFT OUTER JOIN Items AS Item  -- Adding the join to the Items table
        //         ON Item.CategoryID = Category.CategoryID
        //     WHERE CategoryAllocations.LocationID = ${LocationId};
        // `, {
        //     type: db.Sequelize.QueryTypes.SELECT
        // });


        // GET DATA FOR ITEM & CATEGORIES IN DIFFERENT ARRAYS

        const catAllocation = await db.sequelize.query(`
            SELECT 
                CategoryAllocations.ID, 
                CategoryAllocations.LocationID,
                Category.*
            FROM CategoryAllocations 
            LEFT OUTER JOIN Categories AS Category 
                ON CategoryAllocations.CategoryID = Category.CategoryID 
            WHERE CategoryAllocations.LocationID = ${LocationId};
        `, {
            type: db.Sequelize.QueryTypes.SELECT
        });

        const itemAllocation = await db.sequelize.query(`
            SELECT 
                ItemAllocations.ID,
                ItemAllocations.LocationID,
                ItemAllocations.ItemID,
                Items.ItemID,
                Items.ItemName,
                Items.CategoryID,
                Items.Description,
                Items.UnitRate,
                Items.MRP,
                Items.BigUnit,
                Items.OperationalUnit,
                Items.CostingUnit,
                Items.SellingUnit,
                Items.ConversionRatio,
                Items.Remarks,
                ItemLocationRates.*
            FROM Items
            INNER JOIN ItemAllocations ON ItemAllocations.ItemID = Items.ItemID
            LEFT OUTER JOIN ItemLocationRates ON ItemAllocations.ItemID = ItemLocationRates.ItemID and ItemLocationRates.LocationID = ItemAllocations.LocationID
            WHERE ItemAllocations.LocationID = ${LocationId}
            ;
        `, {
            type: db.Sequelize.QueryTypes.SELECT
        });
        // db.itemLocationRate
        // const 
        // console.log(itemAllocation);

        return res.status(200).json({
            message: 'Success',
            categories: catAllocation,
            items: itemAllocation,
            promo: promotionBanner
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error'
        });
    }
}

module.exports = { DashboardData };