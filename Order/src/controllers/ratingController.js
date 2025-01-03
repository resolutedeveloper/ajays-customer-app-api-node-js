const db = require("../models/index.js");

// const submitRating = async (req, res) => {
//     try {
//         const { rating, comment } = req.body; // Expecting rating and an optional comment
//         const customerId = req.UserDetail.CustomerID; // Get CustomerID from the token

//         // Validate rating value
//         if (rating < 1 || rating > 5) {
//             return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
//         }

//         // Fetch the latest order (or a specific order) of the customer
//         const order = await db.order.findOne({
//             where: {
//                 CustomerID: customerId,
//                 OrderStatus: 'accepted', // Assuming we are rating only accepted orders
//             },
//         });

//         if (!order) {
//             return res.status(404).json({ message: 'No accepted orders found for this customer.' });
//         }

//         // Store the rating in the rating table
//         const newRating = await db.rating.create({
//             OrderID: order.OrderID,   // Automatically use the found order's OrderID
//             CustomerID: customerId,   // CustomerID from token
//             Rating: rating,           // Rating value
//             Comment: comment || null, // Optional comment
//         });

//         // Fetch all ratings for the customer and calculate average
//         const ratings = await db.rating.findAll({
//             where: {
//                 CustomerID: customerId,
//             },
//         });

//         // Calculate the average rating
//         const totalRatings = ratings.reduce((acc, curr) => acc + curr.Rating, 0);
//         const averageRating = totalRatings / ratings.length;

//         // Ensure that averageRating is a number before using it
//         const formattedAverageRating = averageRating ? averageRating.toFixed(2) : null;

//         return res.status(201).json({
//             message: 'Rating submitted successfully.',
//             rating: newRating,
//             averageRating: formattedAverageRating, // Rounded to 2 decimal places
//         });
//     } catch (error) {
//         console.error(" ~ Error submitting rating:", error);
//         return res.status(500).json({
//             message: 'Error submitting rating',
//             error: error.message
//         });
//     }
// };


const submitRating = async (req, res) => {
    try {
        const { rating, comment, itemId } = req.body; // Accept ItemID in the request body
        console.log("🚀 ~ submitRating ~ req.body:", req.body);
        const customerId = req.UserDetail.CustomerID; // Get CustomerID from the token
        console.log("🚀 ~ submitRating ~ customerId:", customerId);

        // Validate input values
        if (!itemId) {
            return res.status(400).json({ message: 'ItemID is required.' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        // Fetch the order to validate the customer has ordered the item and get ItemName
        const order = await db.order.findOne({
            where: {
                CustomerID: customerId,
                OrderStatus: 'accepted',
                ItemID: itemId,
            },
            attributes: ['OrderID', 'ItemID', 'ItemName'], // Ensure you fetch ItemName
        });

        if (!order) {
            return res.status(404).json({ message: 'No matching order found for this customer and item.' });
        }

        const { OrderID, ItemName } = order; // Extract necessary fields

        // Store the rating in the rating table
        const newRating = await db.rating.create({
            OrderID,
            CustomerID: customerId,
            Rating: rating,
            Comment: comment || null,
            ItemID: itemId,
            ItemName,
            AverageRatingItem: null, // Set to null initially
        });

        // Calculate the average rating for the specific ItemID
        const ratingsForItem = await db.rating.findAll({
            where: { ItemID: itemId },
        });

        const totalRatings = ratingsForItem.reduce((acc, curr) => acc + curr.Rating, 0);
        const averageRating = parseFloat((totalRatings / ratingsForItem.length).toFixed(1));

        // Update the AverageRatingItem in the rating table for that item, including the new rating
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
                AverageRatingItem: averageRating, // Include the updated average in the response
            },
            averageRating,
        });
    } catch (error) {
        console.error(" ~ Error submitting rating:", error);
        return res.status(500).json({
            message: 'Error submitting rating',
            error: error.message,
        });
    }
};

module.exports = { submitRating };
