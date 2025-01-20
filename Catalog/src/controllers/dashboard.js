const db = require("../models/index.js");
const { promotionBanner } = require("../utils/promotionData.js");

async function DashboardData(req, res) {
    try {
        const { LocationId } = req.query;
        if (!LocationId) {
            return res.status(404).json({
                message: "Location not found"
            })
        }

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
                Items.*  -- Select all fields from the Items table
            FROM ItemAllocations
            LEFT OUTER JOIN Items AS Items 
                ON ItemAllocations.ItemID = Items.ItemID
            WHERE ItemAllocations.LocationID = ${LocationId};
        `, {
            type: db.Sequelize.QueryTypes.SELECT
        });


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