var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
});

schema.plugin(uniqueValidator);

var User = mongoose.model('User', schema);

module.exports = User;