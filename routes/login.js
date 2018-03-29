var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post('/', (req, res, next) => {
    res.redirect('../')
});

module.exports = router;
