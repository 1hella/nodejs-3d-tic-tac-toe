var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', (req, res) => {
    res.render('game', {
        title: 'Game'
    });
});

module.exports = router;
