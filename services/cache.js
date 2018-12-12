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
			console.log("value: "+value);
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
	
	//cache before addSocketID = token : user_id
	//cache after addSocketiD  = token : {user_id, socketID}
	addSocketID(token, sockID, callback) {
		let id;
		this.getValue(token, function (err, result) {
			id = result; //retrieves stored value
		});
		let obj = { user_id: id, socketID: sockID}; //replace with new format
		this.setValue(token, obj, function (err, result) {
			console.log(result);
		});
	}
	
	//recebe formato ["user_id : id1", "user_id : id2", ..]
	//retorna formato [ 'socket1', 'socket2', ...]
	getSockets(usersVector, callback) {
		myCache.keys(function (err, keyList) { //keyList = all token in cache (x no total)
			if(err) return err; 
			myCache.mget(keyList, function(err, result) { //result = cada linha é um valor de um token (x linhas no total)
				var arrayIDs = [];
				var i = usersVector.length;
				for (var x in result) { //para cada linha de result
					if(result.hasOwnProperty(x)) {
						while( i--) {	 // vai ver se o user_id da match de algum elemento do usersVector
							if( result[x].user_id === usersVector[i].ist_id) {
								arrayIDs.push(result[x].socketID);
							}
						}
						i = usersVector.length;
					}
				}
				return callback(err, arrayIDs)
			});	
		});
	}
	
	closeCache() {
		myCache.close();
	}
}

module.exports = new cache();

	
