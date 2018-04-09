'use strict'

var data = {};

module.exports = (server, app) => {
    var io = require('socket.io').listen(server);
    var sharedsession = require("express-socket.io-session");
    var rooms = 1000;

    io.use(sharedsession(app.session));

    io.on('connection', (socket) => {
        var user = socket.handshake.session.user || {
            username: 'null'
        };
        io.emit('chat meta', `${user.username} connected`);

        socket.on('disconnect', () => {
            io.emit('chat meta', `${user.username} disconnected`);
        });

        socket.on('chat message', (msg) => {
            io.emit('chat message', `${user.username}: ${msg}`);
        });

        socket.on('new game', () => {
            rooms++;
            var room = rooms;
            socket.join(room);
            socket.emit('new game', room);
            socket.emit('chat meta', 'Waiting for other player...');
            socket.emit('chat meta', `Tell your friend to join room ${room}!`);
        });
    });

    data.io = io;
    return io;
}

module.exports.io = data.io;