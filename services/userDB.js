// uses the database connection created in database.js
var database = require('./database.js');

class userDB {

    constructor() {

    }

    // insert logged in user in database
    insert(id, name, callback) {

        let db = database.getDB();

        // Check first if user is already in the database and only if not it inserts
        db.collection("users").updateOne({
             "ist_id": id
            }, {
             $set:{ 
                 "name": name
                }
            }, { 
                upsert:true
            }, function(err, res) {
             
                return callback(err, res);
            });

    }

    // returns all the users in the database
    listUsers(callback) {

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("users").find().toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });
    }

    //returns all users by building
    listUsersByBuilding(room,callback) {

        let db = database.getDB();
        let query = { building: room };

        db.collection("users").find(query).toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });

    }

    //updates user location 
    updateLocation(user,latitude,longitude){

        let db = database.getDB();
        var myquery = { ist_id: user };
        var newvalues = { $set: { "location": {
                                    "type":"Point",
                                    "coordinates": [longitude,latitude]
                                }
                        } };
    
        db.collection("users").updateOne(myquery, newvalues,{upsert:true},function(err, docs) {
            
            if(err) {
                 throw err;
             }
             db.collection("users").createIndex( { location : "2dsphere" } );
             console.log("1 location updated in users DB")
        });

        return;
    }

    //updates user's building 
    updateBuilding(user,room){

        let db = database.getDB();
        var myquery = { ist_id: user };
        var newvalues = { $set: { building: room} };
    
        db.collection("users").updateOne(myquery, newvalues,{upsert:true},function(err, docs) {
            
            if(err) {
                 throw err;
             }

             console.log("1 building updated in users DB")
        });

        return;
    }

    listUsersInRange(user){
        // returns all users which are within the defined range for the input user
    }

    // checkUserIsClose(){
    //     //por esta funcao ou a de cima?
    // }

    listUsersNearby(user){
        //makes use of listUsersByBuilding and listUsersInRange? 
        //ou então checka-se se para todos os que estão no building, se estão dentro do range 
        // e nesse caso pode-se meter tipo uma função que checka se está dentro do range

        // returns all users which are within the defined range and in the same building
    }


    setRange(user, range) {
        //returns true if range set successfuly
    }

    // getName(id,callback){

    //     let db = database.getDB();

    //     // checks if the key is in the bots database
    //     db.collection("users").findOne({
    //         "ist_id": id,
    //     }).then(function(doc) {

    //         // if doc not found, return an empty object
    //         if(!doc) {
    //             callback({});
    //         // else return an object with lat and long
    //         } else {
    //             callback({
    //                 "name": doc.name
    //             });
    //         }
    //     });

    // }

}

module.exports = new userDB();