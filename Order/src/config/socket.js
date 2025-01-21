const socketIo = require('socket.io');
const { OrderApprove, OrderReject, OrderPending } = require('../controllers/OrderController');

async function setupSocket(server) {
    const io = socketIo(server);

    async function sendDataToFrontend(socket, room) {
        var LocationID = room.replace("location_room_", "");
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
                callback({ success: result.status == 1 ? true : false, message: result.message });
            });

            socket.on('OrderRejected', async (msg, callback) => {

                /* { OrderID: 'f17a5045-0ab5-4112-a985-75596e761091', Data: { CounterID: 1, OperatorID: 2 }, Reason: "", Remark: "" } */
                const LocationID = room.replace("location_room_", "");
                msg.message.LocationID = LocationID;

                const result = await OrderReject(msg);
                callback({ success: result.status == 1 ? true : false, message: result.message });
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    });

    return io;
}

module.exports = setupSocket;
