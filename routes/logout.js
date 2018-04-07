var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function (req, res, next) {
    req.session.regenerate(function (err) {
        res.render('login', {
            title: 'Login'
        });
    });
});

module.exports = router;