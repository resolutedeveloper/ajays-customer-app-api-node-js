const db = require("../models/index.js");


const submitRating = async (req, res) => {
    try {
        const { rating, comment, itemId } = req.body;
        console.log("🚀 ~ submitRating ~ req.body:", req.body);
        const customerId = req.UserDetail.CustomerID;
        console.log("🚀 ~ submitRating ~ customerId:", customerId);

        if (!itemId) {
            return res.status(400).json({ message: 'ItemID is required.' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        
        const order = await db.order.findOne({
            where: {
                CustomerID: customerId,
                OrderStatus: 'accepted',
                ItemID: itemId,
            },
            attributes: ['OrderID', 'ItemID', 'ItemName'],
        });

        if (!order) {
            return res.status(404).json({ message: 'No matching order found for this customer and item.' });
        }

        const { OrderID, ItemName } = order;

        // Store the rating in the rating table
        const newRating = await db.rating.create({
            OrderID,
            CustomerID: customerId,
            Rating: rating,
            Comment: comment || null,
            ItemID: itemId,
            ItemName,
            AverageRatingItem: null,
        });

        
        const ratingsForItem = await db.rating.findAll({
            where: { ItemID: itemId },
        });

        const totalRatings = ratingsForItem.reduce((acc, curr) => acc + curr.Rating, 0);
        const averageRating = parseFloat((totalRatings / ratingsForItem.length).toFixed(1));

        
        await db.rating.update(
            { AverageRatingItem: averageRating },
            { where: { ItemID: itemId } }
        );

        // Update the AverageRatingItem for the new rating record
        await newRating.update({ AverageRatingItem: averageRating });

        return res.status(201).json({
            message: 'Rating submitted successfully.',
            rating: {
                ...newRating.toJSON(),
                AverageRatingItem: averageRating,
            },
            averageRating,
        });
    } catch (error) {
        console.error(" ~ Error submitting rating:", error);
        return res.status(400).json({
            message: 'Error submitting rating',
            error: error.message,
        });
    }
};

module.exports = { submitRating };
