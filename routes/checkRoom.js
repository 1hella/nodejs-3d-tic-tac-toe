var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    var data = require('../modules/socket').checkRoom(req.body.room);
    if (data.room && !data.error) {
        res.send('/game?room=' + req.body.room);
    } else if (!data.room) {
        res.status(404).send('That room doesn\'t exist!');
    } else {
        res.status(403).send('That room is full!');
    }
});

module.exports = router;