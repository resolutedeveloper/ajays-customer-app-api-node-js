const db = require("../models/index.js")



const submitFeedback = async (req, res) => {
    try {
        const { feedback, orderId } = req.body;
        const customerId = req.UserDetail.CustomerID;

        if (!feedback || feedback.trim().length === 0) {
            return res.status(400).json({ message: 'Feedback is required.' });
        }

        if (!orderId) {
            return res.status(400).json({ message: 'OrderID is required.' });
        }

        const order = await db.order.findOne({
            where: { OrderID: orderId, CustomerID: customerId },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or does not belong to this customer.' });
        }

        const existingFeedback = await db.feedback.findOne({
            where: { CustomerID: customerId, OrderID: orderId },
        });

        if (existingFeedback) {
            await db.feedback.update(
                { Feedback: feedback },
                { where: { FeedbackID: existingFeedback.FeedbackID } }
            );

            return res.status(200).json({
                message: 'Feedback updated successfully.',
                feedback: {
                    FeedbackID: existingFeedback.FeedbackID,
                    CustomerID: existingFeedback.CustomerID,
                    OrderID: existingFeedback.OrderID,
                    Feedback: feedback, // Updated feedback
                },
            });
        } else {
            const newFeedback = await db.feedback.create({
                CustomerID: customerId,
                OrderID: orderId,
                Feedback: feedback,
            });

            return res.status(200).json({
                message: 'Feedback submitted successfully.',
                feedback: {
                    FeedbackID: newFeedback.FeedbackID,
                    CustomerID: newFeedback.CustomerID,
                    OrderID: newFeedback.OrderID,
                    Feedback: newFeedback.Feedback,
                },
            });
        }
    } catch (error) {
        console.error(" ~ Error submitting feedback:", error);
        return res.status(400).json({
            message: 'Error submitting feedback',
            error: error.message,
        });
    }
};

module.exports = { submitFeedback };



