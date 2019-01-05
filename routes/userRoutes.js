const express = require('express')
const router = express.Router()
const request = require('request');
const path = require('path');

// our modules
var userDB = require('../services/userDB.js');
var logsDB = require('../services/logsDB.js');
var buildingDB = require('../services/buildingDB.js');
var filename = __dirname + "/../vars/constants.json";
var cache = require('../services/cache.js');

// APP data:
var client_id = "1414440104755246";
var client_secret = "LKdG1K78CufC/uKyuzw1ReUxufb0oq/OAUNvZl2lIvlWEA3ypLx0pmqPuLCJeqbZGBAXI4TbilRXSACUq9TaTg==";

// comment and uncomment depending if run locally or in the cloud
var redirect_uri = 'https://asint-chat.appspot.com/user/auth';
// var redirect_uri = 'http://localhost:3000/user/auth';

var redirect_page = 'https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=' + client_id + '&redirect_uri=' + redirect_uri;

router.get('/', function(req, res) {

    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){
            res.sendStatus(403);
        }
        else{
            res.sendFile(path.join(__dirname + '/../public/newuser.html'));
        }
    })
})

router.post('/location', function(req, res) {

    //check token
    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            res.sendStatus(403);
            // res.send('please login first');
        }
        else{
            var latitude = Number(req.body.coords.latitude);
            var longitude = Number(req.body.coords.longitude);

            //update user's location in the database
            userDB.updateLocation(id,latitude,longitude,function(err){
                if(err){
                    res.status(500).send("Error updating user location in users database");
                    return;
                }
                console.log("1 location updated in users DB")
            });

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
                    userDB.updateBuilding(id,building_name[0].name,function(err){
                        if(err){
                            res.status(500).send("Error while updating user's building in users database");
                            return;
                        }
                        console.log("Users building updated in users DB")
                    });

                    //insert new movement log
                    logsDB.insertMove(id,latitude,longitude,building_name[0].name,function(err){
                        if(err){
                            res.status(500).send("Error while inserting move in logs database");
                            return;
                        }
                        console.log("1 move inserted in logs DB")
                    });

                }
                else{
                    //update user's building in the database//
                    userDB.updateBuilding(id, null,function(err){
                        if(err){
                            res.status(500).send("Error while updating user's building in users database");
                            return;
                        }
                        console.log("1 building updated in users DB")
                    });

                    //insert new movement log
                    logsDB.insertMove(id,latitude,longitude,null,function(err){
                        if(err){
                            res.status(500).send("Error while inserting move in logs database");
                            return;
                        }
                        console.log("1 move inserted in logs DB")
                    });
                }

                res.sendStatus(200);
            })
        }
    });
})

// Logout of the user
router.get('/logout', function(req, res) {
    //check token
    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){		
            res.sendStatus(403);
        }
        else{
            // clean the user from the database 
            userDB.deleteUser(id, function(err) {
				if(err) {console.log("Error deleting from DB");}
				// clean cache
				cache.deleteValue(req.cookies.user, function (err, count) {
					if(err) {console.log("Error deleting from cache")}
					// clear the cookie 
					res.clearCookie('user');
					res.sendStatus(200);	// Client will redirect to home after receive 200
				});
			});
        }
    });

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
	
        if(response.statusCode == 200) {
            var token = JSON.parse(response.body).access_token

            // uncomment if you want to see the authorization token
            //console.log(token)

            request.get('https://fenix.tecnico.ulisboa.pt/api/fenix/v1/person', {
                'auth': {
                    'bearer' : token
                }
            }, (error, resp) => {

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

                        // TO DELETE
                        // console.log(req.session.user == undefined)
                        // req.session.user = user.username;
                    
                        // set cookies with expiration time of 1h
                        res.cookie('user', token, { expires: new Date(Date.now() + 3600000)});

                        cache.setValue(token, user.username, function(err,success) {

                            if(err && !success) {
                                res.status(500).send("Error saving users token");
                                return;
                            }
                        
                            res.redirect(301, "/user/");
                        });
							
                        
						
                        //res.cookie('token', token);
                        // possibly redirect to another page
                    });
        
                } else {
                    res.status(401).send("Last get: Not authorized to access user");
                }
            });

        } else {
            res.status(401).send("Not authorized to access user");
        }
    });
})

router.post('/range', function(req, res) {

    //check token
    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            res.sendStatus(403);
        }
        else{
            //get range to send from req body
            var range = Number(req.body.range);

            // checking if range is a number 
            if (!isNaN(range) || range > 0){
                // //set new range for the specified user
                userDB.setRange(id, range, function(err, result) {
                    if(err) {
                        res.status(500).send("Error updating user range in the database");
                        return;
                    }

                    // OK
                    res.sendStatus(200);
                })
            }else{
                // NOT OK
                res.sendStatus(400);
            }
        }
    });

})

//see who is nearby: within the range 
router.get('/nearby/range', function(req, res) {
    //check token
    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            // res.redirect(301, '/');
            res.sendStatus(403);
        }
        else{
            userDB.getRange(id, function(results_user){
                if(!Object.keys(results_user).length){
                    res.sendStatus(404);
                }
                
                userDB.listNearbyUsersByRange(id,Number(results_user.range),function(err,results) {
                    if(err) {
                        res.status(500).send("Error getting users from the database");
                        return;
                    }
                    res.send(results); //assuming it returns empty if there are no users
                });
            })
        }
    });
	
})

//see who is nearby: on the same building 
router.get('/nearby/building', function(req, res) {

    //check token
    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            res.sendStatus(403);;
        }
        else{
            userDB.listNearbyUsersByBuilding(id,function(err,results) {
                if(err) {
                    res.status(500).send("Error getting users from the database");
                    return;
                }
                res.send(results); //assuming it returns empty if there are no users
            })
        }
    });
})

// ENDPOINT USED TO DEBUGS
router.get('/receive', function(req, res) {
	
	cache.listKeys(function (err, value) {
		console.log("val: " + value);
	});
	obj = { socketID: 1, variable: 42, t: 3};
	cache.setValue('rui', obj, function (err, value) {
		console.log(value);
	});
	cache.getValue('rui', function (err, value) {
		console.log(value)
	});
	let users = [42]
	cache.getSockets(users, function (err, value) {
		console.log(value);
	});
  
})

//ger user_id
router.get('/id', function(req, res) {

    //check token
    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){
			console.log("und");
            // redirect to the login pag
            //res.redirect(301, '/');
            res.status(403).send('Please login first');
            // res.send('Please login first');        
        }
        else{ 
            res.send(id);
        }
    });
})

//get range
router.get('/range', function(req, res) {

    //check token
    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){
            res.sendStatus(403);
        }
        else{
            userDB.getRange(id,function(results) {
                res.send(results); //assuming it returns empty if there is no range
            })
        }
    });

})

module.exports = router;
