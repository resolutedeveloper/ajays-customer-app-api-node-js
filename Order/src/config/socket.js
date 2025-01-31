const socketIo = require('socket.io');
const logger = require('../utils/logger');
const db = require("../models/index.js");
const moment = require('moment-timezone');
const { sendNotification } = require("../utils/notification.js");
// const { OrderApprove, OrderReject, OrderPending, OrderCompleted, OrderMarkAsRead } = require("../controllers/OrderController.js")

let ioReturn = null;

async function setupSocket(server) {
    const io = socketIo(server);

    async function sendDataToFrontend(socket, room) {
        var LocationID = room.replace("location_room_", "");
        // console.log(OrderPending);
        const OrderApprove_list = await OrderPending(LocationID);
        if (OrderApprove_list.status == 1) {
            io.to(room).emit('PendingOrder', OrderApprove_list.data);
        }
    }

    io.on('connection', (socket) => {
        socket.on('joinRoom', async (room) => {
            socket.join(room);

            sendDataToFrontend(socket, room);

            socket.on('OrderApprove', async (msg, callback) => {
                /* { OrderID: 'f17a5045-0ab5-4112-a985-75596e761091', Data: { CounterID: 1, OperatorID: 2 } } */
                const LocationID = room.replace("location_room_", "");
                msg.message.LocationID = LocationID;
                const result = await OrderApprove(msg);
                console.log('result', result);
                callback({ success: result.status == 1 ? true : false, message: result.message });
            });

            socket.on('OrderRejected', async (msg, callback) => {
                /* { OrderID: 'f17a5045-0ab5-4112-a985-75596e761091', Data: { CounterID: 1, OperatorID: 2 }, Reason: "", Remark: "" } */
                const LocationID = room.replace("location_room_", "");
                msg.message.LocationID = LocationID;

                const result = await OrderReject(msg);
                callback({ success: result.status == 1 ? true : false, message: result.message });
            });

            socket.on('OrderMarkAsRead', async (msg, callback) => {
                /* { OrderID: 'f17a5045-0ab5-4112-a985-75596e761091', Data: { CounterID: 1, OperatorID: 2 } } */
                const LocationID = room.replace("location_room_", "");
                msg.message.LocationID = LocationID;

                const result = await OrderMarkAsRead(msg);
                callback({ success: result.status == 1 ? true : false, message: result.message });
            });

            socket.on('OrderCompleted', async (msg, callback) => {
                /* { OrderID: 'f17a5045-0ab5-4112-a985-75596e761091', Data: { CounterID: 1, OperatorID: 2 }, OTP: "1111" } */
                const LocationID = room.replace("location_room_", "");
                msg.message.LocationID = LocationID;

                const result = await OrderCompleted(msg);
                callback({ success: result.status == 1 ? true : false, message: result.message });
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    });
    ioReturn = io;
    return io;
}

async function getIoInstance() {
    if (!ioReturn) {
        throw new Error("Io not found");
    }

    return ioReturn;
}

// Redefining function due to garbage collection issue

const OrderPending = async (LocationID) => {
    try {
        const OrderList = await db.order.findAll({
            where: {
                OrderStatus: 'Pending',
                LocationID: LocationID,
            },
            include: [
                { model: db.orderDetails },
                { model: db.orderDetailsTax },
            ]
        });
        return {
            status: 1,
            data: OrderList
        }
    } catch (error) {
        return {
            status: 0,
            message: error.message
        }
    }
};

const OrderApprove = async (req) => {
    try {
        req = req.message;

        const db_transaction = await db.sequelize.transaction();
        const OrderList = await db.order.findOne({
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
            include: [
                { model: db.orderDetails },
                { model: db.orderDetailsTax },
            ]
        });

        if (!OrderList) {
            return {
                status: 0,
                message: 'Permission denied'
            }
        }
        if (OrderList.dataValues.OrderStatus != 'Pending') {
            return {
                status: 0,
                message: "This order has already been updated to " + OrderList.dataValues.OrderStatus + " status."
            }
        }

        const CurrentDateTime = moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
        await db.order.update({
            OrderStatus: 'Confirmed',
            UpdatedOn: CurrentDateTime
        }, {
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
        }, {
            transaction: db_transaction, // Use the transaction
        });
        console.log({
            OrderID: req.OrderID,
            OrderStatus: 'Confirmed',
            Data: req.Data,
            CreatedOn: CurrentDateTime
        })
        await db.orderHistory.create(
            {
                OrderID: req.OrderID,
                OrderStatus: 'Confirmed',
                Data: req.Data,
                CreatedOn: CurrentDateTime
            },
            {
                transaction: db_transaction, // Use the transaction
            }
        );

        await sendNotification(OrderList.CustomerID, `OrderApprove`, `Your order is approved`);

        await db_transaction.commit();
        console.log('4')
        return {
            status: 1,
            message: 'Order has been confirmed'
        }
    } catch (error) {
        return {
            status: 0,
            message: error.message
        }
    }
};

const OrderReject = async (req) => {
    try {
        req = req.message;

        const db_transaction = await db.sequelize.transaction();
        const OrderList = await db.order.findOne({
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
            include: [
                { model: db.orderDetails },
                { model: db.orderDetailsTax },
            ]
        });


        if (!OrderList) {
            return {
                status: 0,
                message: 'Permission denied'
            }
        }
        if (OrderList.dataValues.OrderStatus != 'Pending') {
            return {
                status: 0,
                message: "This order has already been updated to " + OrderList.dataValues.OrderStatus + " status."
            }
        }

        req.Data.Reason = req.Reason;
        req.Data.Remark = req.Remark;

        const CurrentDateTime = moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
        await db.order.update({
            OrderStatus: 'Cancelled',
            UpdatedOn: CurrentDateTime,
            Reason: req.Reason,
            Remark: req.Remark
        }, {
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
        }, {
            transaction: db_transaction, // Use the transaction
        });

        await db.orderHistory.create(
            {
                OrderID: req.OrderID,
                OrderStatus: 'Cancelled',
                Data: req.Data,
                CreatedOn: CurrentDateTime
            },
            {
                transaction: db_transaction, // Use the transaction
            }
        );

        await sendNotification(OrderList.CustomerID, `OrderRejected`, `Your order is rejected`);

        await db_transaction.commit();

        return {
            status: 1,
            message: 'Order has been Cancelled'
        }


    } catch (error) {
        return {
            status: 0,
            message: error.message
        }
    }
};

const OrderMarkAsRead = async (req) => {
    try {
        req = req.message;

        const db_transaction = await db.sequelize.transaction();
        const OrderList = await db.order.findOne({
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
            include: [
                { model: db.orderDetails },
                { model: db.orderDetailsTax },
            ]
        });

        if (!OrderList) {
            return {
                status: 0,
                message: 'Permission denied'
            }
        }
        if (OrderList.dataValues.OrderStatus != 'Confirmed') {
            return {
                status: 0,
                message: "This order has already been updated to " + OrderList.dataValues.OrderStatus + " status."
            }
        }

        const CurrentDateTime = moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
        await db.order.update({
            OrderStatus: 'Ready',
            UpdatedOn: CurrentDateTime
        }, {
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
        }, {
            transaction: db_transaction, // Use the transaction
        });

        await db.orderHistory.create(
            {
                OrderID: req.OrderID,
                OrderStatus: 'Ready',
                Data: req.Data,
                CreatedOn: CurrentDateTime
            },
            {
                transaction: db_transaction, // Use the transaction
            }
        );

        await sendNotification(OrderList.CustomerID, `OrderMarkAsRead`, `Your order is marked Read`);

        await db_transaction.commit();

        return {
            status: 1,
            message: 'Order has been Mark As Read'
        }
    } catch (error) {
        return {
            status: 0,
            message: error.message
        }
    }
};

const OrderCompleted = async (req) => {
    try {
        req = req.message;

        const db_transaction = await db.sequelize.transaction();
        const OrderList = await db.order.findOne({
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
            include: [
                { model: db.orderDetails },
                { model: db.orderDetailsTax },
            ]
        });
        if (!OrderList) {
            return {
                status: 0,
                message: 'Permission denied'
            }
        }
        if (OrderList.dataValues.OrderStatus != 'Ready') {
            return {
                status: 0,
                message: "This order has already been updated to " + OrderList.dataValues.OrderStatus + " status."
            }
        }

        if (OrderList.dataValues.OTP != req.OTP) {
            return {
                status: 0,
                message: "Invalid OTP provided, please try again."
            }
        }
        const CurrentDateTime = moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
        await db.order.update({
            OrderStatus: 'Completed ',
            UpdatedOn: CurrentDateTime
        }, {
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
        }, {
            transaction: db_transaction, // Use the transaction
        });

        await db.orderHistory.create(
            {
                OrderID: req.OrderID,
                OrderStatus: 'Completed',
                Data: req.Data,
                CreatedOn: CurrentDateTime
            },
            {
                transaction: db_transaction, // Use the transaction
            }
        );

        await sendNotification(OrderList.CustomerID, `OrderCompleted`, `Your order is marked completed`);

        await db_transaction.commit();

        return {
            status: 1,
            message: 'Order has been Completed'
        }

    } catch (error) {
        return {
            status: 0,
            message: error.message
        }
    }
};

// Module exports
module.exports = { setupSocket, getIoInstance };
