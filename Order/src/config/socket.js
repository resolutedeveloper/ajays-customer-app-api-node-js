// src/config/socket.js
const socketIo = require('socket.io');

function setupSocket(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);

        // Room join karna
        socket.on('joinRoom', (room) => {
            console.log(`User joined room: ${room}`);
            socket.join(room);  // Join the room

            // Room me message bhejna
            socket.on('chatMessage', (msg) => {
                io.to(room).emit('message', msg);  // Broadcast to room
            });

            // User disconnect hone par
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    });

    return io;
}

module.exports = setupSocket;
