const express = require('express')
const router = express.Router()

var botDB = require('../services/botDB.js');

router.post('/', function(req, res) {

    var key = req.body.key;

    if(botDB.checkBot(key)) {

        // Send message
        var message = req.body.message;
        // TODO

        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
})

module.exports = router;
