const express = require('express')
const router = express.Router()
var userDB = require('../services/userDB.js');
var logsDB = require('../services/logsDB.js');


// NOTA: users é a instancia da classe userDB

// APP data:
// client id: 1414440104755246
// client secret: LKdG1K78CufC/uKyuzw1ReUxufb0oq/OAUNvZl2lIvlWEA3ypLx0pmqPuLCJeqbZGBAXI4TbilRXSACUq9TaTg==
// 

router.get('/', function(req, res) {
    
    res.send('Hello User! ')

})



router.post('/:user/location', function(req, res) {
 
    var user=req.params.user;
    var latitude = parseInt(req.body.coords.latitude);
    var longitude = parseInt(req.body.coords.longitude);
    // nao sei se aqui é preciso checkar alguma coisa // TODO

    //CHECKAR SE ELE O USER AINDA ESTÁ NALGUM SITIO? // TODO <- TIPO SE ELE SE TIVER DESCONECTADO

    //update user's location in the database
    userDB.updateLocation(user,latitude,longitude)
    
    //UPDATE BROWSER'S DATA // TODO  

    buildingDB.findNearestBuilding(latitude,longitude,filename.building_range,function(building_name){
    
        //checking if user is in one of the registered buildings
        if(!Object.keys(building_name).length){
     
            //update user's building in the database//só se for diferente?? // TODO
            userDB.updateBuilding(user, building_name);

            //insert new movement log
            logsDB.insertMove(user,building_name);

        }
        else{
            
            //update user's building in the database//só se for diferente?? // TODO
            userDB.updateBuilding(user, []);

            //insert new movement log
            //logsDB.insertMove(user,building_name);
        }

        res.sendStatus(200);
    })
})

// Login of the user
router.post('/:user/login', function(req, res) {
    // TODO

})

// Logout of the user
router.post('/:user/logout', function(req, res) {
    // TODO

})

// TODO
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