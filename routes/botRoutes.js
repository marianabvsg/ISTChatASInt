const express = require('express')
const router = express.Router()

var userdb = require('../app.js');

router.post('/', function(req, res) {
    
    delete require.cache[require.resolve('../app.js')]
    var userdb = require('../app.js');

    console.log(userdb.print())

    res.send({
        'apikey': 'aaa-aaa',
        'message': 'ayoooo'
    })

})

module.exports = router;