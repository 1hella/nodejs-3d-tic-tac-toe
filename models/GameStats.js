var mongoose = require('mongoose');

// wins/losses are stored in User
var schema = new mongoose.Schema({
    room: {
        type: Number
    },
    ongoing: {
        type: Boolean
    },
    timeStarted: {
        type: Date
    },
    winner: {
        type: String
    },
    loser: {
        type: String
    },
    numMoves: {
        type: Number
    },
    players: [String]
});

var GameStats = mongoose.model('GameStats', schema);

module.exports = GameStats;