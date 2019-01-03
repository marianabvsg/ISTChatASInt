const express = require('express')
const router = express.Router()

// our own services
var botDB = require('../services/botDB.js');
var messageService = require('../services/sockets.js');

router.post('/', function(req, res) {
    var key = req.body.key;
    botDB.checkBot(key, function(err, building) {
		
        // no bot in the db with that key
        if(err || building == null) {
            res.sendStatus(403);
            return;
        }

        // there were results in the db

        // Send message
        var message = {
            'user': 'Bot ' + building,
            'data': req.body.message
        }

        if(message == null) {
            res.status(404).send("Error: Message not stated.");
            return;
        }

        // send message to the users in the building
        messageService.sendMessage(message, building, function(err) {
            if(err) {
                console.log(err);
                res.status(500).send(err);
                return;

            } else {
				console.log(message)
                // everything was OK
                res.sendStatus(200);
                return;
            }
        });

    })
})

module.exports = router;
