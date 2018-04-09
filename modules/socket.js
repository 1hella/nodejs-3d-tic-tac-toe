'use strict'

module.exports = (server, app) => {
    var io = require('socket.io').listen(server);
    var sharedsession = require("express-socket.io-session");

    io.use(sharedsession(app.session));

    io.on('connection', (socket) => {
        var user = socket.handshake.session.user || { username: 'null' };
        io.emit('chat meta', `${user.username} connected`);

        socket.on('disconnect', () => {
            io.emit('chat meta', `${user.username} disconnected`);
        });

        socket.on('chat message', (msg) => {
            io.emit('chat message', `${user.username}: ${msg}`);
        });
    });

    return io;
}