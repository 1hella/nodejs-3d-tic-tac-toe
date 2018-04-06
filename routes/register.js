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
            res.render('register', {
                title: 'Register',
                error: 'Username already taken'
            });
        } else {
            console.log(`Created user ${user.username}`);
            req.session.user = user;
            res.redirect('../dashboard');
        }
    });
});

module.exports = router;