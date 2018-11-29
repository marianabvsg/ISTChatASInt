// uses the database connection created in database.js
var database = require('./database.js');

class botDB {

    constructor() {

    }

    insert(key, building) {

        let db = database.getDB();
        
		db.collection("bots").insertOne({
            "key": key,
            "building": building
         }, function(err, res) {
             if(err) {
                 throw err;
             }

             console.log("1 doc inserted")
         });

        return;
    }

    
    // return building if key valid, not permited otherwise
    checkBot(key) {

        let db = database.getDB();

        // checks if the key is in the bots database
        db.collection("bots").findOne({
            "key": key
        }, function(err, docs) {
            console.log(docs)

            if(err) {
                throw err;
            // didn't find the key in the db
            } else if(docs)  {
                return false;
            // found the key in the db
            } else {
                return true;
            }
        })
    }

}

module.exports = new botDB();
