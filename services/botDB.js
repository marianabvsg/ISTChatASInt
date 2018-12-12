// uses the database connection created in database.js
var database = require('./database.js');

class botDB {

    constructor() {

    }

    // insert new bot in the bot's database
    insert(key, building) {

        // gets the db object
        let db = database.getDB();
        
        // inserts in the db the bot's key and building
		db.collection("bots").insertOne({
            "key": key,
            "building": building
         }, function(err, res) {
             if(err) {
                 throw err;
             }

             console.log("1 doc inserted in bots DB")
         });

        return;
    }

    
    // return building if key valid, not permited otherwise
    checkBot(key, callback) {

        // gets the db object
        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("bots").findOne({
            "key": key
        }, function(err, doc) {

            if(err) {
                return callback(err, null);
            } else {

                return callback(err, doc.building);
            }

        });
    }

}

module.exports = new botDB();
