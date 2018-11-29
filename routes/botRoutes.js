const express = require('express')
const router = express.Router()

var botDB = require('../services/botDB.js');

router.post('/', function(req, res) {

    var key = req.body.key;

    botDB.checkBot(key, function(result) {

        // there were results in the db
        if(result == true) {

            // Send message
            //     var message = req.body.message;
            //     // TODO

            res.sendStatus(200);

        // no bot in the db with that key
        } else {
            res.sendStatus(403);
        }
    })
})

module.exports = router;
