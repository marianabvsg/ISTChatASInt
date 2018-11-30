const express = require('express')
const router = express.Router()

// NOTA: users é a instancia da classe userDB

// APP data:
// client id: 1414440104755246
// client secret: LKdG1K78CufC/uKyuzw1ReUxufb0oq/OAUNvZl2lIvlWEA3ypLx0pmqPuLCJeqbZGBAXI4TbilRXSACUq9TaTg==
// 

router.get('/', function(req, res) {
    
    res.send('Hello User! ')

})

router.post('/:user/location', function(req, res) {


})

// Login of the user
router.post('/:user/login', function(req, res) {
    // TODO

})

// Logout of the user
router.post('/:user/logout', function(req, res) {
    // TODO

})

router.post('/:user/message', function(req, res) {

    //get message to send from req body
    var message = req.body.message;

    // get all users in my range:
    var nearbyUsers= users.listUsersInRange(req.params.user);

    //checkar se a lista é empty
	// percorrer a lista e para cada user na lista enviar a mensagem pretendida 
    for(var receiver in nearbyUsers) {
    	//NAO TENHO BEM A CERTEZA SE ISTO É ASSIM, DEPOIS VER CONSOANTE O QUE FOR MANDADO
    	//send message to receiver
    	//TODO
	}
})

router.post('/:user/range', function(req, res) {

	//get range to send from req body
    var range = req.body.range;

    //checking if range is a number ? TODO

    //set new range for the specified user
    var user= req.params.user;
    var success = users.setRange(user, range);

    if (success) {
    	res.sendStatus(200);
    }
    else{
    	res.sendStatus(400); //TODO: 400? ou 404 se o user não for found? snot sure
    }

    return;
})

//see who is nearby: on the range of the messages and on the same buiding.
router.get('/:user/nearby', function(req, res) {

	//check user? TODO
	var user = req.params.user;
	var usersNearby = users.listUsersNearby(user);
	res.send(usersNearby);

})

router.get('/:user/receive', function(req, res) {

    // TODO


})

module.exports = router;