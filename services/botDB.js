// uses the database connection created in database.js
var db = require('./database.js');

module.exports = class botDB {

    constructor() {

    }

    insert(key, building) {
		console.log(db);
		db.createCollection("Rui");
    }

    checkBot(key) {

        // return building if key valid, not permited otherwise
    }

}
