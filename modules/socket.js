'use strict';
var GameStats = require('../models/GameStats');
var User = require('../models/User');

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
            GameStats.create({
                room: room,
                ongoing: true,
                players: [user.username]
            }, (err, res) => {
                if (err) {
                    console.log('error');
                }
            });
        });

        socket.on('join game', function (room) {
            var data = checkRoom(room);

            if (data.room && !data.error) {
                socket.join(room);
                io.in(room).emit('chat meta', `${user.username} joined the room`);
                socket.to(room).emit('player joined');
                GameStats.findOneAndUpdate({
                    room: room,
                    ongoing: true
                }, {
                    $set: {
                        timeStarted: new Date
                    },
                    $push: {
                        players: user.username
                    }
                }, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if (data.error) {
                socket.emit('err', data.error);
            }
        });

        socket.on('game move', board => {
            socket.to(getRoom()).emit('opponent move', board);
        });

        socket.on('game win', data => {
            socket.to(getRoom()).emit('game lose', user.username);
            GameStats.findOne({
                room: getRoom(),
                ongoing: true
            }, (err, gameStat) => {
                if (err) {
                    console.log('error finding gamestat on game win');
                } else {
                    gameStat.winner = user.username;
                    gameStat.numMoves = data.numMoves;
                    gameStat.ongoing = false;
                    gameStat.loser = gameStat.players.filter(player => player !== user.username)[0];

                    User.findOneAndUpdate({
                        username: gameStat.winner
                    }, {
                        $inc: {
                            wins: 1
                        }
                    }, err => {
                        if (err) {
                            console.log('couldn\'t increment user wins');
                        }
                    });

                    User.findOneAndUpdate({
                        username: gameStat.loser
                    }, {
                        $inc: {
                            losses: 1
                        }
                    }, err => {
                        if (err) {
                            console.log('couldn\'t increment user wins');
                        }
                    });

                    gameStat.save(err => {
                        if (err) {
                            console.log('couldn\'t update gameStat');
                        }
                    });
                }
            });
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