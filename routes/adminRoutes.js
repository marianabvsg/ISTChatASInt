const express = require('express')
const router = express.Router()
var apikey = require("apikeygen").apikey;
const fs = require('fs');

// my requirements
var filename = __dirname + "/../vars/constants.json";
var userDB = require('../services/userDB.js');

// temporary variable
const adminkey = "secretkey";

router.get('/login', function(req, res) {
    
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
// TODO
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

    // get the array of buildings
    res.send(building_file)

    // Convert them in order to insert in the Building's database
    // https://www.opentechguides.com/how-to/article/nodejs/124/express-mysql-json.html
    // https://stackoverflow.com/questions/15367477/fastest-way-to-get-json-object-into-mysql-using-node

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
// TODO
router.get('/list/users', function(req, res) {
    
    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }

    // get the list of users from the database
    let users = new userDB();



    res.send([{
        "name": "renato"
    },{
        "name": "paulo"
    },{
        "name": "marianadestruidoradeclips"
    }])
})

// returns a list with all the users in a certain building
// TODO
router.get('/list/users/building/:building', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }
    
})

// returns a list with all the messages in a certain building
// TODO
router.get('/list/logs/messages/:building', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }
    
})

// returns a list with all the messages of a certain user
// TODO
router.get('/list/logs/messages/:user', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }
    
})

// returns a list with all the movements of a certain user
// TODO
router.get('/list/logs/movements/:user', function(req, res) {

    // check if the secret is correct
    const secret = req.body.adminkey;

    // validate secret
    if(secret == null || secret == {} || secret != adminkey) {
        
        res.sendStatus(403);
        return;
    }
    
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

    const building = req.body.building;

    // check authentication of admin
    // TODO

    // if the building exists
    if(building == null /* or doesn't belong to the DB of buildings */) {

        // not found
        res.sendStatus(403);
    } else {

        var key = apikey();  // generates 40 char base64 encoded key

        // save the key into the DB with the correspondent building
        // TODO

        

        // return the key to the admin
        // mandar status 200????
        res.send({
            'key': key
        })
    }
})

module.exports = router;