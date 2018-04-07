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
    User.create(user, (err, createdUser) => {
        if (err) {
            res.render('register', {
                title: 'Register',
                error: 'Username already taken',
                user: user
            });
        } else {
            console.log(`Created user ${createdUser.username}`);
            req.session.user = createdUser;
            res.redirect('../dashboard');
        }
    });
});

module.exports = router;