// File with the database connection
var MongoClient = require( 'mongodb' ).MongoClient;

var database_name = "mongodb://localhost:27017";
var _db;

module.exports = {

  // initiates the connection to the DB Server
  connectToServer: function( callback ) {

    MongoClient.connect(database_name, function( err, db ) {

        // set the name of the collection
        _db = db.db("asint");

        return callback( err );
    });
    
  },

  // get the DB state
  getDB: function() {
    return _db;
  }
};


