// File with the database connection

// ALGO DESTE GÉNERO MAS PARA O NOSSO CASO
// var mysql = require('mysql');
// var connection = mysql.createConnection({
// host     : '127.0.0.1',
// user     : 'root',
// password : '',
// database : 'chat'
// });

// connection.connect(function(err) {
// if (err) throw err;
// });

// module.exports = connection;

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

let _db;

//conecta ao servidor
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
	if (err) throw 'Error connecting do db';
	//dentro do servidor escolhe a db com nome asint
	_db = db.db("asint");
	console.log('Successfully connected to db');
});

module.exports = _db;


