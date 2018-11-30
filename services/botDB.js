// uses the database connection created in database.js
var database = require('./database.js');

class botDB {

    constructor() {

    }

    // insert new bot in the bot's database
    insert(key, building) {

        let db = database.getDB();
        
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

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("bots").findOne({
            "key": key
        }).then(function(doc) {

            console.log(!doc)

            if(!doc) {
                return callback(false);
            } else {
                return callback(true);
            }

        });
    }

}

module.exports = new botDB();
