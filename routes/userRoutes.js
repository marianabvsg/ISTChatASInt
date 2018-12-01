const express = require('express')
const router = express.Router()
const request = require('request');

// NOTA: users é a instancia da classe userDB

// APP data:
var client_id = "1414440104755246";
var client_secret = "LKdG1K78CufC/uKyuzw1ReUxufb0oq/OAUNvZl2lIvlWEA3ypLx0pmqPuLCJeqbZGBAXI4TbilRXSACUq9TaTg==";
var redirect_uri = 'http://127.0.0.1:3000/user/auth';
// 

router.get('/', function(req, res) {
    
    res.send('Hello User! ')

})

router.post('/:user/location', function(req, res) {


})

// Login of the user
router.get('/login', function(req, res) {
    // TODO

    res.redirect('https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=' + client_id + '&redirect_uri=' + redirect_uri)
})

// Auth
router.get('/auth', function(req, res) {

    if(req.query.error == "access_denied") {

        console.log(req.query.error);

        // send the error back to the user
        res.status(401).send('Forbidden: ' + req.query.error_description);
    }

    console.log(req.query.code);

    let code = req.query.code;

    //let auth_path = "/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&redirect_uri=" + redirect_uri + "&code=" + code + "&grant_type=authorization_code";

    request.post("https://fenix.tecnico.ulisboa.pt/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&redirect_uri=" + redirect_uri + "&code=" + code + "&grant_type=authorization_code", (err, response, body) => {

        if (err) { 
            return console.log(err); 
        }

        if(res.statusCode == 200) {

            console.log(body);
            res.send(response.body);

            //https://fenix.tecnico.ulisboa.pt/api/fenix/v1/person

        } else {
            res.send(401, "Not authorized to access user");
        }
 
    });
})

// Logout of the user
router.post('/:user/logout', function(req, res) {
    // TODO

    // clean the user from the database 

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