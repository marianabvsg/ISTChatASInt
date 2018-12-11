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
var redirect_uri = 'http://localhost:3000/user/auth';
var redirect_page = 'https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=' + client_id + '&redirect_uri=' + redirect_uri;
// 

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../public/user.html'));

    //check token
    // cache.getValue(req.cookies.token, function(err,id) {
    //     if (id==undefined){
    //         // redirect to the login page
    //         res.redirect(301, '/');
    //     }
    //     else{
    //         //console.log("Cookies :  ", req.cookies);

    //         // user not authenticated
    //         // TO DELETE
    //         // if(req.session.user == null) {
    //         //     res.status(400).send("gtfo");
    //         // } else {
    //         //     res.status(400).send("hello " + req.session.user);
    //         // }
    //     }
    // });
})


router.post('/location', function(req, res) {

    //check token
    cache.getValue(req.cookies.user.token, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            res.redirect(301, '/');
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
                        console.log("1 building updated in users DB")
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
// TODO
router.get('/logout', function(req, res) {

    //check token
    cache.getValue(req.cookies.user.token, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            res.redirect(301, '/');
        }
        else{
            // clean the user from the database 
            // TODO

            // clear the cookie 
            res.clearCookie('user');
            
            // clean cache
            // TODO

            // redirect to the login page
            res.redirect(301, '/');
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

        if(res.statusCode == 200) {

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
                        // 
                        // set cookies
                        res.cookie('user', {
                            'id': user.username,
                            'token': token
                        });

                        cache.setValue(token, user.username, function(err,success) {
                            if(success){
                                res.redirect(301, "/user/");
                            }
                            else{
                                res.status(500).send("Error saving users token");
                                return;  
                            }
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


// TODO
router.post('/message', function(req, res) {

    //check token
    cache.getValue(req.cookies.user.token, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            res.redirect(301, '/');
        }
        else{
            //SEND MESSAGE // TODO
        }
    });

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

router.post('/range', function(req, res) {

    //check token
    cache.getValue(req.cookies.user.token, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            res.redirect(301, '/');
        }
        else{
            //get range to send from req body
            var range = Number(req.body.range);

            // checking if range is a number 
            if (!isNaN(range)){
                // //set new range for the specified user
                userDB.setRange(id, range, function(err, result) {
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
        }
    });

	// //get range to send from req body
 //    var range = Number(req.body.range);
 //    var user= req.params.user;
    
 //    //check if user exists in our database?? // TODO

 //    // checking if range is a number 
 //    if (!isNaN(range)){

	//     // //set new range for the specified user
	//     userDB.setRange(user, range, function(err, result) {
	// 		if(err) {
	// 			res.status(500).send("Error updating user range in the database");
	// 			return;
	// 		}

	// 		//DO STUFF // TODO
	// 		res.sendStatus(200);
	// 	})
	// }else{
	// 	res.sendStatus(400);
	// }

})

//see who is nearby: within the range 
router.get('/nearby/range', function(req, res) {

    //check token
    cache.getValue(req.cookies.user.token, function(err,id) {

        if (id==undefined){
            // redirect to the login page
            res.redirect(301, '/');
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
	
 //    var user=req.params.user;
 //    // get user's range 
 //    userDB.getRange(user, function(results_user){
 //    	if(!Object.keys(results_user).length){
 //    		res.sendStatus(404);
 //    	}
		
	//     userDB.listNearbyUsersByRange(user,Number(results_user.range),function(err,results) {

	// 		if(err) {
	// 			res.status(500).send("Error getting users from the database");
	// 			return;
	// 		}

	//         // VER COMO MANDAR RESULTADOS // TODO
	//         res.send(results); //assuming it returns empty if there are no users
	//     });
	// })

})

//see who is nearby: on the same building 
router.get('/nearby/building', function(req, res) {

    //check token
    cache.getValue(req.cookies.user.token, function(err,id) {
        if (id==undefined){
            // redirect to the login page
            res.redirect(301, '/');
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

// TO DELETE PROBABLY -- TESTES DA CACHE
router.get('/receive', function(req, res) {
	obj = { my: "Special", variable: 42 };
	cache.setValue('rui', obj, function (err, value) {
		console.log(value);
	});
	cache.getValue('rui', function (err, value) {
		console.log(value);
	});
	obj = { my: "Special", variable: 42, t: 3};
	cache.setValue('rui', obj, function (err, value) {
		console.log(value);
	});
	cache.getValue('rui', function (err, value) {
		console.log(value);
	});
	cache.listKeys(function (err, value) {
		console.log(value);
	});
    // TODO
  
})

//ger user_id
router.get('/id', function(req, res) {

    //check token
    console.log("HEREEEEEE");
    console.log(req.cookies.user.token);
    cache.getValue(req.cookies.user.token, function(err,id) {
        console.log("ID:")
        console.log(id);
        if (id==undefined){
            // redirect to the login page
            res.redirect(301, '/');
        }
        else{
            res.send(id);
        }
    });
    // cache.listKeys(function(err,result){
    //     console.log('here')
    //     console.log(result);
    // });
})

// router.get('/:user', function(req, res) {

//     res.sendFile(path.join(__dirname + '/../public/user.html'));
// })

// function checkUserToken(req){
//     cookie_user_params=req.cookies;

//     if()
// }

module.exports = router;
