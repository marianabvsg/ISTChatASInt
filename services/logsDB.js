// uses the database connection created in database.js
var database = require('./database.js');

class logsDB {

    constructor() {

    }

    //insert new message in the logs_messages db
    insertMessage(user_id, message,building,callback) {

        let db = database.getDB();
        
        db.collection("logs_messages").insertOne({
            "ist_id": user_id,
            "msg": message,
            "building": building
         }, function(err, res) {
             
            return callback(err)
         });

    }

    //insert new movement in the logs_movements db
    insertMove(user_id, latitude, longitude, building,callback) {

        let db = database.getDB();
        
        db.collection("logs_moves").insertOne({
            "ist_id": user_id,
            "coordinates" : {
                "longitude": longitude,
                "latitude":  latitude
            },
            "building": building
         }, function(err, res) {
            return callback(err);
         });

    }

    listAll(callback) {
        
        var self=this;

        this.listAllMoves(function(results_moves) {

            self.listAllMessages(function(results_msgs) {

            // let db = database.getDB();

            // let results_moves= db.collection("logs_movements").find().toArray();

            let logs= results_msgs.concat(results_moves);
            callback(logs)
        })
        
        })
    }

    listAllMessages(callback){

        let db = database.getDB();

        db.collection("logs_messages").find().toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });

    }

    listAllMoves(callback){

        let db = database.getDB();

        db.collection("logs_moves").find().toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });
        
    }

    listByUser(user,callback) {

        var self=this;

        this.listMovesByUser(user,function(results_moves) {

            self.listMessagesByUser(user,function(results_msgs) {

            // let db = database.getDB();

            // let results_moves= db.collection("logs_movements").find().toArray();

            let logs= results_msgs.concat(results_moves);
            callback(logs)
        })
        
        })

    }

    listMovesByUser(user,callback) {

        let db = database.getDB();
        let query = { ist_id: user };

        db.collection("logs_moves").find(query).toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });

    }

    listMessagesByUser(user,callback) {

        let db = database.getDB();
        let query = { ist_id: user };

        db.collection("logs_messages").find(query).toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });

    }

    listByBuilding(room,callback) {

        var self=this;

        this.listMovesByBuilding(room,function(results_moves) {

            self.listMessagesByBuilding(room,function(results_msgs) {

            // let db = database.getDB();

            // let results_moves= db.collection("logs_movements").find().toArray();

            let logs= results_msgs.concat(results_moves);
            callback(logs)
        })
        
        })

    }

    listMessagesByBuilding(room,callback) {

        let db = database.getDB();
        let query = { building: room };

        db.collection("logs_messages").find(query).toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });

    }

    listMovesByBuilding(room,callback) {

        let db = database.getDB();
        let query = { building: room };

        db.collection("logs_moves").find(query).toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });

    }

}

module.exports = new logsDB();