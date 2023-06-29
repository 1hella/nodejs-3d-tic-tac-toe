const mongoose = require('mongoose');

// wins/losses are stored in User
const schema = new mongoose.Schema({
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

const GameStats = mongoose.model('GameStats', schema);

module.exports = GameStats;