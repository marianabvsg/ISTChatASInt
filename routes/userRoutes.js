const express = require('express')
const router = express.Router()
const request = require('request');
const path = require('path');

// our modules
var userDB = require('../services/userDB.js');
var logsDB = require('../services/logsDB.js');
var buildingDB = require('../services/buildingDB.js');
var filename = __dirname + "/../vars/constants.json";

// APP data:
var client_id = "1414440104755246";
var client_secret = "LKdG1K78CufC/uKyuzw1ReUxufb0oq/OAUNvZl2lIvlWEA3ypLx0pmqPuLCJeqbZGBAXI4TbilRXSACUq9TaTg==";
var redirect_uri = 'http://localhost:3000/user/auth';
var redirect_page = 'https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=' + client_id + '&redirect_uri=' + redirect_uri;
// 

router.get('/', function(req, res) {
    
    res.send('Hello User! ')
})

router.get('/:user', function(req, res) {

    res.sendFile(path.join(__dirname + '/../public/user.html'));
})

router.post('/:user/location', function(req, res) {
 
    var user=req.params.user;
    var latitude = parseFloat(req.body.coords.latitude);
    var longitude = parseFloat(req.body.coords.longitude);

    // nao sei se aqui é preciso checkar alguma coisa // TODO
    //CHECKAR SE ELE     O USER AINDA ESTÁ NALGUM SITIO? // TODO <- TIPO SE ELE SE TIVER DESCONECTADO
    // ou aquilo retorna alguma cena se não encontrar a lat e long?

    //chekcar se user existe? // TODO

    //update user's location in the database
    userDB.updateLocation(user,latitude,longitude,function(err){
    	if(err){
    		res.status(500).send("Error updating user location in users database");
            return;
    	}
		console.log("1 location updated in users DB")
    });

    //UPDATE BROWSER'S DATA // TODO  

    var file = require(filename)
    let range= Number(file.building_range);

    buildingDB.findNearestBuilding(latitude,longitude,range, function(errbuilding,building_name){
    
    	if(errbuilding){
    		res.status(500).send("Error getting user's building from the database");
			return;
    	}

        //checking if user is in one of the registered buildings
        if(building_name.length){       
    
            //update user's building in the database
            // we choose the nearest building
            userDB.updateBuilding(user,building_name[0].name,function(err){
    			if(err){
    				res.status(500).send("Error while updating user's building in users database");
            		return;
    			}
				console.log("1 building updated in users DB")
    		});

            //insert new movement log
            logsDB.insertMove(user,latitude,longitude,building_name[0].name,function(err){
				if(err){
    				res.status(500).send("Error while inserting move in logs database");
            		return;
    			}
				console.log("1 move inserted in logs DB")
            });

        }
        else{
            //update user's building in the database//
            userDB.updateBuilding(user, null,function(err){
    			if(err){
    				res.status(500).send("Error while updating user's building in users database");
            		return;
    			}
				console.log("1 building updated in users DB")
    		});

            //insert new movement log
            logsDB.insertMove(user,latitude,longitude,null,function(err){
				if(err){
    				res.status(500).send("Error while inserting move in logs database");
            		return;
    			}
				console.log("1 move inserted in logs DB")
            });
        }

        res.sendStatus(200);
    })
})

// Login of the user
router.get('/login', function(req, res) {
    
    res.send({
        redirect: redirect_page
    })
})

// Auth
router.get('/auth', function(req, res) {

    if(req.query.error == "access_denied") {

        //console.log(req.query.error);

        // send the error back to the user
        res.status(401).send('Forbidden: ' + req.query.error_description);
    }

    // uncomment if you want to see the code
    //console.log(req.query.code);

    request.post("https://fenix.tecnico.ulisboa.pt/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&redirect_uri=" + redirect_uri + "&code=" + req.query.code + "&grant_type=authorization_code", (err, response, body) => {

        if (err) { 
            console.log("Error in second phase");
            return console.log(err); 
        }

        if(res.statusCode == 200) {

            var token = JSON.parse(response.body).access_token

            // uncomment if you want to see the authorization token
            //console.log(token)

            request.get('https://fenix.tecnico.ulisboa.pt/api/fenix/v1/person', {
                'auth': {
                    'bearer' : token
                }
            }, (error, resp, body) => {

                if (error) { 
                    return console.log(error); 
                }
        
                if(resp.statusCode == 200) {

                    var user = JSON.parse(resp.body)
                    
                    // just for debug
                    //res.send(JSON.parse(resp.body));

                    // get the istID and name
                    // insert it in the database
					let consts_file = require(filename);
    				let range= Number(consts_file.default_user_range);
                    userDB.insert(user.username, user.name, range,function(err, result) {

                        if(err) {
                            res.status(500).send("Error inserting user in the database");
                            return;
                        }

                        // res.status(200).send({
                        //     user: user.username,
                        //     name: user.name
                        // });

                        // possibly redirect to another page
                        // TODO
                        res.redirect("/user/");
                        //res.sendFile(path.join(__dirname + '/../public/user.html'));
                    })
        
                } else {
                    res.status(401).send("Last get: Not authorized to access user");
                }
            });

        } else {
            res.status(401).send("Not authorized to access user");
        }
    });
})

// Logout of the user
router.post('/:user/logout', function(req, res) {
    // TODO

    // clean the user from the database 

})

// TODO
router.post('/:user/message', function(req, res) {

 //    //get message to send from req body
 //    var message = req.body.message;

 //    // get all users in my range:
 //    var nearbyUsers= users.listUsersInRange(req.params.user);

 //    //checkar se a lista é empty
	// // percorrer a lista e para cada user na lista enviar a mensagem pretendida 
 //    for(var receiver in nearbyUsers) {
 //    	//NAO TENHO BEM A CERTEZA SE ISTO É ASSIM, DEPOIS VER CONSOANTE O QUE FOR MANDADO
 //    	//send message to receiver
 //    	//TODO
	// }
})

// TODO
router.post('/:user/range', function(req, res) {

	//get range to send from req body
    var range = Number(req.body.range);
    var user= req.params.user;

    //check if user exists in our database?? // TODO

    // checking if range is a number 
    if (!isNaN(range)){

	    // //set new range for the specified user
	    userDB.setRange(user, range, function(err, result) {

			if(err) {
				res.status(500).send("Error updating user range in the database");
				return;
			}

			//DO STUFF // TODO
			res.sendStatus(200);
		})
	}else{
		res.sendStatus(400);
	}

})

//see who is nearby: within the range 
router.get('/:user/nearby/range', function(req, res) {

    //check user?? // TODO
	
    var user=req.params.user;
    // get user's range 
    userDB.getRange(user, function(results_user){
    	if(!Object.keys(results_user).length){
    		res.sendStatus(404);
    	}
		
	    userDB.listNearbyUsersByRange(user,Number(results_user.range),function(err,results) {
	        
			if(err) {
				res.status(500).send("Error getting users from the database");
				return;
			}

	        // VER COMO MANDAR RESULTADOS // TODO
	        res.send(results); //assuming it returns empty if there are no users
	    });
	})

})

//see who is nearby: on the same building 
router.get('/:user/nearby/building', function(req, res) {

    //check user?? // TODO

    userDB.listNearbyUsersByBuilding(req.params.user,function(err,results) {

		if(err) {
			res.status(500).send("Error getting users from the database");
			return;
		}

        // VER COMO MANDAR RESULTADOS // TODO
        res.send(results); //assuming it returns empty if there are no users
    })

})

router.get('/:user/receive', function(req, res) {

    // TODO
  

})

	
	
module.exports = router;
