'use strict';

const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
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

const User = mongoose.model('User', schema);

module.exports = User;
