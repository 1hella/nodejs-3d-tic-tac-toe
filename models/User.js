'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    gender: {
        type: String
    },
    birthday: {
        type: Date
    },
    password: {
        type: String
    },
    email: {
        type: String,
        lowercase: true
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0,
    }
});

var User = mongoose.model('User', schema);

module.exports = User;
