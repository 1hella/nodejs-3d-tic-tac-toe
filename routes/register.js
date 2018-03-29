var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', (req, res) => {
    res.render('register', {
        title: 'Register'
    });
});

router.post('/', (req, res) => {
    var user = new User(req.body);
    User.create(user, (err, user) => {
        if (err) {
            res.end(500, err);
        } else {
            console.log(`Created user ${user.username}`);
            res.redirect('../');
        }
    });
});

module.exports = router;