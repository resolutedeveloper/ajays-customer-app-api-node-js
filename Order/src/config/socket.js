// src/config/socket.js
const socketIo = require('socket.io');

function setupSocket(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        socket.on('joinRoom', (room) => {
            socket.join(room);

            socket.on('OrderApprove', (msg) => {
                msg = {
                    OrderID: 'fed69341-cd2f-4417-b7a3-507252a68d8c',
                    Data: {
                        CounterID: 1,
                        OperatorID: 2
                    }
                }
                const LocationID = room.replace("location_room_", "");
                msg.LocationID = LocationID;
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    });

    return io;
}

module.exports = setupSocket;
