'use strict';

var data = {};
module.exports.listen = (server, app) => {
    var io = require('socket.io').listen(server);
    var sharedsession = require("express-socket.io-session");
    var rooms = 1000;

    io.use(sharedsession(app.session));

    io.on('connection', (socket) => {

        var getRoom = () => socket.rooms[Object.keys(socket.rooms)[0]];

        var user = socket.handshake.session.user || {
            username: 'null'
        };

        socket.on('disconnecting', () => {
            var room = getRoom();
            io.in(room).emit('chat meta', `${user.username} left the room`);
        });

        socket.on('chat message', (msg) => {
            io.in(getRoom()).emit('chat message', `${user.username}: ${msg}`);
        });

        socket.on('new game', () => {
            rooms++;
            var room = rooms;
            socket.join(room);
            socket.emit('new game', room);
            socket.emit('chat meta', `${user.username} joined the room`);
            socket.emit('chat meta', `Tell your friend to join room ${room}!`);
        });

        socket.on('join game', function (room) {
            var data = checkRoom(room);

            if (data.room && !data.error) {
                socket.join(room);
                io.in(room).emit('chat meta', `${user.username} joined the room`);
                socket.to(room).emit('player joined');
            } else if (data.error) {
                socket.emit('err', data.error);
            }
        });
    });

    data.io = io;
    return io;
};

function checkRoom(room) {
    var results = {};
    var room = data.io.nsps['/'].adapter.rooms[room];
    results.room = room;

    if (!room) {
        results.error = 'That room doesn\'t exist!';
    } else if (room.length > 1) {
        results.error = 'Sorry, that room is full!';
    }

    return results;
}

module.exports.checkRoom = checkRoom;
module.exports.io = () => data.io;