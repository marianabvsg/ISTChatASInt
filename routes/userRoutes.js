const express = require('express')
const router = express.Router()

router.get('/', function(req, res) {
    
    res.send('Hello User! ')

})

router.post('/:user/location', function(req, res) {


})

router.post('/:user/auth', function(req, res) {
    // TODO
})

router.post('/:user/message', function(req, res) {

    
})

router.post('/:user/range', function(req, res) {


})

router.get('/:user/nearby', function(req, res) {

})

router.get('/:user/receive', function(req, res) {
    // TODO
})

module.exports = router;