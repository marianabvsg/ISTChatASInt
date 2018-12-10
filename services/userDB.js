// uses the database connection created in database.js
var database = require('./database.js');

class userDB {

    constructor() {

    }

    // insert logged in user in database
    insert(id, name, range,callback) {

        let db = database.getDB();

        // Check first if user is already in the database and only if not it inserts
        db.collection("users").updateOne({
             "ist_id": id
            }, {
             $set:{ 
                 "name": name,
                 "range": range
                }
            }, { 
                upsert:true
            }, function(err, res) {
             
                return callback(err, res);
            });

    }

    // returns all the users in the database
    listAll(callback) {

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("users").find().toArray(function(err, docs) {

            //returns all users
            return callback(err,docs);
        });
    }

    //returns all users by building
    listByBuilding(room,callback) {

        let db = database.getDB();
        let query = { building: room };

        db.collection("users").find(query).toArray(function(err, docs) {

            //returns all users
            return callback(err,docs);
        });

    }

    //updates user location 
    updateLocation(user,latitude,longitude,callback){

        let db = database.getDB();
        var myquery = { ist_id: user };
        var newvalues = { $set: { "location": {
                                    "type":"Point",
                                    "coordinates": [longitude,latitude]
                                }
                        } };
    
        db.collection("users").updateOne(myquery, newvalues,{upsert:true},function(err, docs) {
            
            if(err){
                throw err;
            }

            db.collection("users").createIndex( { location : "2dsphere" } );
            return callback(err)
        });

    }

    //updates user's building 
    updateBuilding(user,room,callback){

        let db = database.getDB();
        var myquery = { ist_id: user };
        var newvalues = { $set: { building: room} };
    
        db.collection("users").updateOne(myquery, newvalues,{upsert:true},function(err, docs) {          
            return callback(err)
        });

        return;
    }

    listInRange(latitude,longitude,range,callback){
        // receives the range of the user, and the latitude and longitude 
        // returns all users which are within the defined range for the input user
        let db = database.getDB();
        let query = {location:  {
            $near: {
                $geometry: {
                    "type": "Point" ,
                    "coordinates": [ longitude, latitude ]
                },
                $maxDistance: range
            }
        }};
        let proj= { ist_id: 1, name: 1};

        db.collection("users").find(query,{ projection: proj }).toArray(function(err, docs) {
            //returns all users
            callback(err,docs);
        });
    }


    listInBuilding(building_name,callback){
        // returns all users which are in the same building
        let db = database.getDB();
        let query = { building: building_name };

        let proj= { ist_id: 1, name: 1};

        db.collection("users").find(query,{ projection: proj }).toArray(function(err, docs) {
            
            //returns all users
            callback(err,docs);
        });
    }


    getCoordinates(user_id,callback){

        let db = database.getDB();

        // checks if the key is in the users database
        db.collection("users").findOne({
            "ist_id": user_id
        }).then(function(doc) {
            // if doc not found, return an empty object
            if(!doc) {
                callback({});
            // else return an object with lat and long
            } else {
                callback({
                    "lat": doc.location.coordinates[1],
                    "long": doc.location.coordinates[0]
                });
            }
        });
    }


    getBuilding(user_id,callback){

        let db = database.getDB();

        // checks if the key is in the users database
        db.collection("users").findOne({
            "ist_id": user_id
        }).then(function(doc) {
            // if doc not found, return an empty object
            if(!doc) {
                callback({});
            // else return an object with lat and long
            } else {
                callback({
                    "building": doc.building
                });
            }
        });        
    }

    listNearbyUsersByRange(user_id,range,callback){

        var self=this;
		
        //get user coordinates from the db
        this.getCoordinates(user_id,function(coords) {
            //get list of nearby users
            self.listInRange(coords.lat,coords.long,range,function(err,results) {
                //remove the user from this list
                let users = results.filter(function(el) { return el.ist_id != user_id; }); 
                callback(err,users)
            })       
        })
    }

    listNearbyUsersByBuilding(user_id,callback){

        var self=this;

        //get user building from the db
        this.getBuilding(user_id,function(res) {
            //get list of nearby users (in the same building)
            self.listInBuilding(res.building,function(err,results) {

                //remove the user from this list
                let users = results.filter(function(el) { return el.ist_id != user_id; }); 
                callback(err,users)
            })       
        })
    }

    setRange(user_id,new_range,callback){

        let db = database.getDB();
        var myquery = { ist_id: user_id };
        var newvalues = { $set: { range: new_range} };
    
        db.collection("users").updateOne(myquery,newvalues,function(err, docs) {
            
            return callback(err, docs);  

        });

        return;
    
    }

    getRange(user_id,callback){

        let db = database.getDB();
        // checks if the key is in the users database
        db.collection("users").findOne({
            "ist_id": user_id
        }).then(function(doc) {
            // if doc not found, return an empty object
            if(!doc) {
                callback({});
            // else return an object with range
            } else {
                callback({
                    "range": doc.range
                });
            }
        }); 

    }
    

}

module.exports = new userDB();
