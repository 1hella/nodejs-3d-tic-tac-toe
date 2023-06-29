const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', function (req, res, next) {
    req.session.regenerate(function (err) {
        res.render('login', {
            title: 'Login'
        });
    });
});

module.exports = router;