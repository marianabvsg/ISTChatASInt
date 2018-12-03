// uses the database connection created in database.js
var database = require('./database.js');
const geolib = require('geolib');

class buildingDB {

    constructor() {

    }

    // receives a building name and returns its coordinates 
    getCoordinates(name,callback) {

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("buildings").findOne({
            "name": name
        }).then(function(doc) {

            // if doc not found, return an empty object
            if(!doc) {
                callback({});
            // else return an object with lat and long
            } else {
                callback({
                    "lat": doc.lat,
                    "long": doc.long
                });
            }
        });
    }

    // receives a building coordinates and returns its name
    getName(lat, long,callback) {

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("buildings").findOne({
            "lat": lat,
            "long": long
        }).then(function(doc) {

            // if doc not found, return an empty objectç
            if(!doc) {
                callback({});
            // else return an object with lat and long
            } else {
                callback({
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

    listAll(callback){

        let db = database.getDB();

        db.collection("buildings").find().toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });
    }

    findNearestBuilding(lat,long,range,callback){

        // dist = geolib.getDistance(
        //     {latitude: lat, longitude: long},
        //     {latitude: , longitude: }
        // );

        //POR ISTO NO INSERT!

        let db = database.getDB();
        // db.collection("buildings").createIndex( { location : "2dsphere" } );
        //db.collection("buildings").ensureIndex({ location: '2dsphere' })

        let query = {location:  {
            $near: {
                $geometry: {
                    "type": "Point" ,
                    "coordinates": [ long , lat ]
                },
                $maxDistance: range
            }
        }};

        //{'location':{ $near: [ lat, long ], $maxDistance: 10}};
        let proj= { name: 1};

        db.collection("buildings").find(query,{ projection: proj }).toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });


    //     this.listAll(function(buildings){

    //         var building_name = new Array();

    //         for(var building of buildings)           
    //             //check if user's coordinates are within the specified range given the building coordinates
    //             if (cenas){
    //                 building_name.push(building.name);
    //             }

    //         callback(building_name)
    //     })        
    // }
    }  

}

module.exports = new buildingDB();