// File with the database connection
var MongoClient = require( 'mongodb' ).MongoClient;

var database_name = "mongodb://localhost:27017";
var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect(database_name, function( err, db ) {
      _db = db.db("asint");
      return callback( err );
    } );
  },

  getDB: function() {
    return _db;
  }
};


