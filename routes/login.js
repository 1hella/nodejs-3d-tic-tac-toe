var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function (req, res, next) {
    var error = req.flash('error');
    error = error != '' ? error : undefined;
    res.render('login', {
        title: 'Login',
        flash: error
    });
});

router.post('/', (req, res, next) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) {
            res.render('login', {
                title: 'Login',
                error: `Error: ${err}`
            });
        } else if (!user) {
            res.render('login', {
                title: 'Login',
                error: 'No user with that username exists'
            });
        } else {
            user.verifyPassword(req.body.password, (err, isValid) => {
                if (err) {
                    res.render('login', {
                        title: 'Login',
                        error: `Error: ${err}`
                    });
                } else if (!isValid) {
                    res.render('login', {
                        title: 'Login',
                        error: 'Password was incorrect'
                    });
                } else {
                    req.session.user = user;
                    res.redirect('./dashboard');
                }
            });
        }
    });
});

module.exports = router;
