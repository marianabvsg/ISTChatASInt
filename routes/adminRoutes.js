const express = require('express')
const router = express.Router()

// temporary variable
const adminkey = "secretkey";

router.get('/login', function(req, res) {
    
    // ADD SECURITY LATER

    if(req.body.username == 'admin' &&  req.body.password == '123') {
        // the user is the admin
        // authentication OK
        
        // return a key to the admin
        res.send({
            'adminkey': adminkey
        })

    } else {
        // authentication NOK

        // don't return nothing
        res.send({
            'adminkey': null
        })
    }

})

router.post('/building', function(req, res) {
    
})

router.get('/list/users', function(req, res) {
    
})

router.get('/list/users/building/:building', function(req, res) {
    
})

router.get('/list/logs/messages/:building', function(req, res) {
    
})

router.get('/list/logs/messages/:user', function(req, res) {
    
})

router.get('/list/logs/movements/:user', function(req, res) {
    
})

router.get('/bot', function(req, res) {
    
})


module.exports = router;