const express = require('express')
const router = express.Router()
const request = require('request');

// our modules
var userDB = require('../services/userDB.js');
var logsDB = require('../services/logsDB.js');


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
 
    var user=req.params.user;
    var latitude = parseInt(req.body.coords.latitude);
    var longitude = parseInt(req.body.coords.longitude);

    // nao sei se aqui é preciso checkar alguma coisa // TODO

    //CHECKAR SE ELE O USER AINDA ESTÁ NALGUM SITIO? // TODO <- TIPO SE ELE SE TIVER DESCONECTADO

    // CHECKAR SE O USER JÁ TEM BUILDING OU NÃO

    //update user's location in the database
    userDB.updateLocation(user,latitude,longitude)
    
    //UPDATE BROWSER'S DATA // TODO  

    buildingDB.findNearestBuilding(latitude,longitude, filename.building_range, function(building_name){
    
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
router.get('/login', function(req, res) {
    
    res.redirect('https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=' + client_id + '&redirect_uri=' + redirect_uri)
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
                    userDB.insert(user.username, user.name, function(err, result) {

                        if(err) {
                            res.status(500).send("Error inserting user in the database");
                            return;
                        }

                        res.sendStatus(200);

                        // possibly redirect to another page
                        // TODO
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

// access_token_request_url = 'https://fenix.tecnico.ulisboa.pt/oauth/access_token'
//     request_data = {'client_id': int(APP['clientID']), 'client_secret': APP['clientSecret'],
//             'redirect_uri': APP['redirectURI'], 'code': session['code'], 'grant_type': 'authorization_code'}

//     reqAccessToken = requests.post(access_token_request_url, data=request_data)


//     params = {'access_token': session['access_token']}
//     request_info = requests.get('https://fenix.tecnico.ulisboa.pt/api/fenix/v1/person', params=params)
