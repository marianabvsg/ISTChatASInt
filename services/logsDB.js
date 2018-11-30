// uses the database connection created in database.js
var database = require('./database.js');

class logsDB {

    constructor() {

    }

    insertMessage(user_id, message,callback) {

        //return
    }

    insertMove(user_id, building) {
        
        //return
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
        let query = { user_id: user };

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
        let query = { user_id: user };

        db.collection("logs_messages").find(query).toArray(function(err, docs) {
            
            if(err) {
                throw err;
            }

            //returns all users
            callback(docs);
        });

    }

    listByBuilding() {

    }

    listMessagesByBuilding() {

    }

}

module.exports = new logsDB();