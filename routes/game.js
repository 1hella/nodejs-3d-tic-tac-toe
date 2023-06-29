const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.render('game', {
        title: 'Game',
        user: req.session.user
    });
});

module.exports = router;
