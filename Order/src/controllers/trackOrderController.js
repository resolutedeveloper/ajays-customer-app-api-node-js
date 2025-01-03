const db = require("../models/index.js");



const orderList = async (req, res) => {
    try {
        const customerId = req.UserDetail.CustomerID; // Get CustomerID from the token

        // Fetch only accepted orders for the customer
        const orders = await db.order.findAll({
            where: { 
                CustomerID: customerId,
                OrderStatus: 'accepted' // Only fetch orders with 'accepted' status
            }
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No accepted orders found for this customer' });
        }

        // Map the orders into the desired response format, including totalAmount for the list
        const orderList = orders.map(order => {
            // Calculate the total amount for the order by multiplying quantity and mrp
            const totalAmount = order.Quantity * parseFloat(order.MRP);

            return {
                orderID: order.OrderID,
                items: [
                    {
                        itemName: order.ItemName,
                        quantity: order.Quantity,
                        mrp: order.MRP,
                        orderStatus: order.OrderStatus,
                    }
                ],
                totalAmount: totalAmount.toFixed(2) // Calculating total amount and formatting it
            };
        });

        return res.status(200).json({ orders: orderList });
    } catch (error) {
        console.error(" ~ Error fetching accepted orders:", error);
        return res.status(400).json({ message: 'Error fetching accepted orders', error: error.message });
    }
};



const orderDetails = async (req, res) => {
    try {
        const customerId = req.UserDetail.CustomerID; // Get CustomerID from the token

        // Fetch only accepted orders for the customer
        const orders = await db.order.findAll({
            where: { 
                CustomerID: customerId,
                OrderStatus: 'accepted' // Only fetch orders with 'accepted' status
            }
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No accepted orders found for this customer' });
        }

        // Map the orders into the desired response format, including more item details
        const orderDetails = orders.map(order => {
            // Calculate the total amount for the order by multiplying quantity and finalRate
            const totalAmount = order.Quantity * parseFloat(order.MRP);

            return {
                orderID: order.OrderID,
                items: [
                    {
                        itemID: order.ItemID,
                        itemName: order.ItemName,
                        quantity: order.Quantity,
                        mrp: order.MRP,
                        orderStatus: order.OrderStatus,
                    }
                ],
                totalAmount: totalAmount.toFixed(2) // Calculating total amount and formatting it to 2 decimal places
            };
        });

        return res.status(200).json({ orders: orderDetails });
    } catch (error) {
        console.error(" ~ Error fetching accepted orders:", error);
        return res.status(400).json({ message: 'Error fetching accepted orders', error: error.message });
    }
};



module.exports = { orderList, orderDetails };

  
