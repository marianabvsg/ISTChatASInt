// uses the database connection created in database.js
var database = require('./database.js');

class userDB {

    constructor() {

    }

    insert() {

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

    listUsersByBuilding(building) {

        // get building coords

        // 
        
        //returns all users by building
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

}

module.exports = new userDB();