const db = require("../models/index.js");


const rateApp = async (req, res) => {
    try {
        const { rating } = req.body;
        const customerId = req.UserDetail.CustomerID;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const existingRating = await db.rateAPP.findOne({
            where: { CustomerID: customerId },
        });

        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this app.' });
        }

        const newRating = await db.rateAPP.create({
            CustomerID: customerId,
            Rating: rating,
            AverageRatingApp: null,
        });

        const allRatings = await db.rateAPP.findAll();
        const totalRatings = allRatings.reduce((acc, curr) => acc + curr.Rating, 0);
        const averageRatingApp = parseFloat((totalRatings / allRatings.length).toFixed(1));


        await db.rateAPP.update(
            { AverageRatingApp: averageRatingApp },
            { where: {} }
        );


        return res.status(200).json({
            message: 'App rated successfully.',
            rating: {
                RateAppID: newRating.RateAppID,
                CustomerID: newRating.CustomerID,
                Rating: newRating.Rating,
            },
            averageRatingApp: averageRatingApp,
        });
    } catch (error) {
        console.error(" ~ Error rating the app:", error);
        return res.status(400).json({
            message: 'Error rating the app',
            error: error.message,
        });
    }
};



const updateRating = async (req, res) => {
    try {
        const { rating } = req.body;
        const customerId = req.UserDetail.CustomerID;


        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }


        const existingRating = await db.rateAPP.findOne({
            where: { CustomerID: customerId },
        });

        if (!existingRating) {
            return res.status(400).json({ message: 'You have not rated the app yet.' });
        }

        await db.rateAPP.update(
            { Rating: rating },
            { where: { CustomerID: customerId } }
        );


        const allRatings = await db.rateAPP.findAll();
        const totalRatings = allRatings.reduce((acc, curr) => acc + curr.Rating, 0);
        const averageRatingApp = parseFloat((totalRatings / allRatings.length).toFixed(1));


        await db.rateAPP.update(
            { AverageRatingApp: averageRatingApp },
            { where: {} }
        );


        return res.status(200).json({
            message: 'App rating updated successfully.',
            rating: {
                RatingID: existingRating.RateAppID,
                CustomerID: existingRating.CustomerID,
                Rating: rating,
            },
            averageRatingApp: averageRatingApp,
        });
    } catch (error) {
        console.error(" ~ Error updating rating:", error);
        return res.status(400).json({
            message: 'Error updating rating',
            error: error.message,
        });
    }
};





module.exports = {rateApp, updateRating}