// uses the database connection created in database.js
var database = require('./database.js');

class buildingDB {

    constructor() {

    }

    // receives a building name and returns its coordinates 
    getCoordinates(name) {

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("buildings").findOne({
            "name": name
        }).then(function(doc) {

            // if doc not found, return an empty object
            if(!doc) {
                return callback({});
            // else return an object with lat and long
            } else {
                return callback({
                    "lat": doc.lat,
                    "long": doc.long
                });
            }
        });
    }

    // receives a building coordinates and returns its name
    getName(lat, long) {

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("buildings").findOne({
            "lat": lat,
            "long": long
        }).then(function(doc) {

            // if doc not found, return an empty objectç
            if(!doc) {
                return callback({});
            // else return an object with lat and long
            } else {
                return callback({
                    "name": doc.name
                });
            }
        });
    }

    // insert from jsonfile of buildings into the database
    insertFromFile(jsonfile, callback) {

        let db = database.getDB();
        
        // insert bulk data from jsonfile of buildings
		db.collection("buildings").insert(jsonfile, function(err, res) {
            callback(err, res);
         });
    }

    // insert one building into the database
    insert(id, name, lat, long) {

        let db = database.getDB();
        
		db.collection("buildings").insertOne({
            "id": id,
            "name": name,
            "lat": lat,
            "long": long
         }, function(err, res) {
             if(err) {
                throw err;
             }

            callback(err, res);
         });

        return;
    }

}

module.exports = new buildingDB();