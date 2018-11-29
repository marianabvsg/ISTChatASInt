const express = require('express')
const router = express.Router()

var botDB = require('../services/botDB.js');

router.post('/', function(req, res) {
    
    var bot = new botDB();
    
    bot.insert("afs","asdf");

    res.send({
        'apikey': 'aaa-aaa',
        'message': 'ayoooo'
    })

})

module.exports = router;
