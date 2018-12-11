const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

//https://github.com/mpneuried/nodecache

class cache {
	
	constructor() {}

	setValue(token, value, callback) {
		myCache.set(token, value, function (err, success) {
			return callback(err, success)
		});
	}

	//é possivel fazer get de varios valores ao mesmo tmepo se for preciso

	getValue(token, callback) {
		myCache.get(token, function (err, value) {
			return callback(err,value) //value == undefined if not match
		});
	}

	deleteValue(token, callback) {
		myCache.del(token, function (err, count) {
			return callback(err, count) //0 if the not match
		});
	}
	
	listKeys(callback) {
		myCache.keys( function (err, result) {
			return callback(err,result)
		});
	}
	
	closeCache() {
		myCache.close();
	}
}

module.exports = new cache();

	
