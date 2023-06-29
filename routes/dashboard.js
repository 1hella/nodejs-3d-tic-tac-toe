const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', function (req, res, next) {
  User.findOne({ username: req.session.user.username }, (err, user) => {
    res.render('dashboard', {
      title: 'Dashboard',
      user: user
    });
  });
});

module.exports = router;