// File with the database connection
var MongoClient = require( 'mongodb' ).MongoClient;

var uri = "mongodb+srv://asint:asint20@cluster0-dh9bp.mongodb.net/test?retryWrites=true";
var _db;

module.exports = {

  // initiates the connection to the DB Server
  connectToServer: function( callback ) {

    MongoClient.connect(uri, function( err, db ) {
		
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


