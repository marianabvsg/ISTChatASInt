const express = require('express')
const router = express.Router()
var apikey = require("apikeygen").apikey;
const fs = require('fs');

// my requirements
var filename = __dirname + "/../vars/constants.json";
var userDB = require('../services/userDB.js');
var botDB = require('../services/botDB.js');
var buildingDB = require('../services/buildingDB.js');
var logsDB = require('../services/logsDB.js');
var buildingDB = require('../services/buildingDB.js');

// temporary variable
const adminkey = "secretkey";

// login of admin, gives secretkey if username and password are correct
router.post('/login', function(req, res) {
    
    // ADD SECURITY LATER
    // TODO

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

// receive a JSON file with buildings
router.post('/building', function(req, res) {

    const secret = req.body.adminkey;
    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

    // receive JSON file
    const building_file = req.body.building;
    // check if it's a valid JSON file
    // TODO

    // get the array of buildings
    buildingDB.insertFromFile(req.body.building, function(err, result) {

        if(err) {
            console.log(err)
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    })
})

// updates the default range of the buildings
router.post('/building/range', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        // forbidden
        res.sendStatus(403);
        return;
    }

    // open and change constants file
    var file = require(filename)

    // receive default range of buildings
    file.building_range = req.body.building_range

    fs.writeFileSync(filename, JSON.stringify(file, null, 2));

    // Success
    res.sendStatus(200);
    return;
})

// returns a list with all logged in users
router.get('/list/users', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

    // get the list of users from the database
    // assuming we have available the object users from the userDB class
    // assuming we receive the list in json format
    userDB.listAll(function(err,results) {

        if(err) {
            res.status(500).send("Error getting all users from the database");
            return;
        }

        res.send(results); //assuming it returns empty if there are no users
    })
    

})

// returns a list with all the users in a certain building
router.get('/list/users/building/:building', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

	//check if building exists in the database
    buildingDB.getCoordinates(req.params.building, function(results){
    	
    	if(!Object.keys(results).length){
    		res.sendStatus(404);
    	}
    })


	//find users 
	userDB.listByBuilding(req.params.building,function(err,results){

        if(err) {
            res.status(500).send("Error getting all users from the database");
            return;
        }

		res.send(results);
	})
})


// returns a list with all the logs
router.get('/list/logs', function(req, res) {
	
    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

	logsDB.listAll(function(results) {

        res.send(results); //assuming it returns empty if there are no users
    })

})


// returns a list with all the messages
router.get('/list/logs/messages', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

   	logsDB.listAllMessages(function(results) {

        res.send(results); //assuming it returns empty if there are no users
    }) 
})


// returns a list with all the movements
router.get('/list/logs/movements', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

	logsDB.listAllMoves(function(results) {

        res.send(results); //assuming it returns empty if there are no users
    })   
})


// returns a list with all the messages in a certain building
router.get('/list/logs/messages/building/:building', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

    //check if building exists in the database
    buildingDB.getCoordinates(req.params.building, function(results){
    	
    	if(!Object.keys(results).length){
    		res.sendStatus(404);
    	}
    })

    // find logs for the requested building
	logsDB.listMessagesByBuilding(req.params.building,function(results) {

        res.send(results); //assuming it returns empty if there are no users
    })
})


// returns a list with all the movements of a certain building
router.get('/list/logs/movements/building/:building', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }
  
    //check if building exists in the database
    buildingDB.getCoordinates(req.params.building, function(results){

    	if(!Object.keys(results).length){
    		res.sendStatus(404);
    	}
    })

    logsDB.listMovesByBuilding(req.params.building,function(results) {

        res.send(results); //assuming it returns empty if there are no users
    })
})


// returns a list with all the messages of a certain user
router.get('/list/logs/messages/user/:user', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

 //    //check if user exists in the database
	// userDB.getCoordinates(req.params.user, function(results){
    	
 //    	if(!Object.keys(results).length){
 //    		res.sendStatus(404);
 //    	}
 //    })
    logsDB.listMessagesByUser(req.params.user,function(results) {

        res.send(results); //assuming it returns empty if there are no users
    })
})


// returns a list with all the movements of a certain user
router.get('/list/logs/movements/user/:user', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }
  
    logsDB.listMovesByUser(req.params.user,function(results) {

        res.send(results); //assuming it returns empty if there are no users
    })
})


// returns a list with all the logs of a certain user
router.get('/list/logs/user/:user', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

    logsDB.listByUser(req.params.user,function(results) {

        res.send(results); //assuming it returns empty if there are no users
    })
})


// returns a list with all the logs of a certain building
router.get('/list/logs/building/:building', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

	//check if building exists in the database
    buildingDB.getCoordinates(req.params.building, function(results){
    	
    	if(!Object.keys(results).length){
    		res.sendStatus(404);
    	}
    })
  
 	logsDB.listByBuilding(req.params.building,function(results) {

        res.send(results); //assuming it returns empty if there are no users
    })
})


// Generate an api key for a new bot
router.get('/bot', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

    // the get request is supposed to receive the building of the bot
    
    // FLOW OF THIS FUNCTION
    // if the building exists
    // generate unique api key
    // save the key into the DB with the correspondent building
    // return the key
    //MUDAR ISTO, POR NOS PARAMS - TODO
    const building = req.body.building;


    // if the building exists
    if(building == null /* or doesn't belong to the DB of buildings TODO */) {

        // not found
        res.sendStatus(403);
    } else {

        var key = apikey();  // generates 40 char base64 encoded key

        // save the key into the DB with the correspondent building
        botDB.insert(key, building);
    
        // return the key to the admin
        // mandar status 200????
        res.send({
            'key': key
        })
    }
})

module.exports = router;
