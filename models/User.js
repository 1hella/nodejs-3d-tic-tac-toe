'use strict';

var mongoose = require('mongoose');
var mongooseBcrypt = require('mongoose-bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

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
        type: String,
        bcrypt: true
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
        default: 0
    }
});

schema.plugin(mongooseBcrypt);
schema.plugin(uniqueValidator);

var User = mongoose.model('User', schema);

module.exports = User;
