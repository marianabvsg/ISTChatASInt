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
                    "lat": doc.location.coordinates[1],
                    "long": doc.location.coordinates[0]
                });
            }
        });
    }

    // receives a building coordinates and returns its name
    getName(lat,long,callback) {

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("buildings").findOne({
            "location":{
                type: "Point",
                "coordinates": [long,lat]
            }
        }).then(function(doc) {

            // if doc not found, return an empty object
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

        for(let room of jsonfile){
            room.location={
                "type": "Point",
                "coordinates": [room.long, room.lat]
            }
            delete room.long;
            delete room.lat;
        }

        // insert bulk data from jsonfile of buildings
		db.collection("buildings").insert( jsonfile,function(err, res) {
            // db.collection("buildings").createIndex( { "id": 1 } , { unique: true } )
            db.collection("buildings").createIndex( { location : "2dsphere" } );
            callback(err, res);
         });
    }

    // insert one building into the database
    insert(id, name, lat, long , callback) {

        let db = database.getDB();
        
		db.collection("buildings").updateOne(
            { "id" : id }
            ,
            {$set: {
            "name": name,
            "location":{
                "type": "Point",
                "coordinates": [long,lat]
            }

         }}, {upsert:true},
          function(err, res) {
             if(err) {
                throw err;
             }
            db.collection("buildings").createIndex( { location : "2dsphere" } );
            callback(err, res);
         });

        return;
    }

    listAll(callback){

        let db = database.getDB();

        db.collection("buildings").find().toArray(function(err, docs) {
            
            //returns all users
            callback(err,docs);
        });
    }

    findNearestBuilding(lat,long,range,callback){

        let db = database.getDB();

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
            
            //returns all users
            callback(err,docs);
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