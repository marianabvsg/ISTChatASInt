const express = require('express')
const router = express.Router()

router.post('/', function(req, res) {
    
    res.send({
        'apikey': 'aaa-aaa',
        'message': 'ayoooo'
    })

})

module.exports = router;