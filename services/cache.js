const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

//https://github.com/mpneuried/nodecache

class cache {
	
	constructor() {}
	//3600 = ttl in seconds
	setValue(token, value, callback) {
		myCache.set(token, value, 3600, function (err, success) {
			return callback(err, success)
		});
	}


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
	
	//gets the user id matching the token
	getUserID(token, callback) {
		myCache.get(token, function(err, value) {
			if(value.user_id != undefined) {
				value = value.user_id;
			}
			return callback(err, value)  //value == undefined if not match
		});
	}
	
	printCache(callback) {
		myCache.keys( function (err, keys) {
			myCache.mget(keys, function (err, result)  {
				console.log("Cache state:");
				console.log(result)
			});
		});
		return callback(null);
	}
	
	
	//cache line before addSocketID = token : user_id
	//cache line after addSocketiD  = token : {user_id, socketID}
	//used when the socket is created, to attribute a socketID to a user in the cache
	//when page is refreshed, a new socket is created, since the user had already a socketID, only needs to update it
	addSocketID(token, sockID, callback) {
		let obj;
		let self = this;
		this.getValue(token, function (err, result) {
			if(err) {return err}
			if(result===undefined) {return callback(null)} //no match for this token, do nothing
			if(result.socketID != undefined) {
				obj = {user_id: result.user_id, socketID: sockID} //when page is refreshed after logging, updates socketID
			} else { 											  
				obj = { user_id: result, socketID: sockID}; //replace with new format
			}
			self.setValue(token, obj, function (err, result) {
				if(err) {return err}
				return callback(null); //success
			});
		});
	}
	
	//recebe formato ["user_id : id1", "user_id : id2", ..]
	//retorna formato [ 'socket1', 'socket2', ...]
	getSockets(usersVector, callback) {
		myCache.keys(function (err, keyList) { //keyList = all token in cache (x no total)
			if(err) return err; 
			if(keyList === undefined || keyList.length == 0) {return callback(null)} //cache empty, do nothing
			myCache.mget(keyList, function(err, result) { //result = cada linha é um valor de um token (x linhas no total)
				if(err) return err;
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
				return callback(null, arrayIDs); //success
			});	
		});
	}
	
	closeCache() {
		myCache.close();
	}
}

module.exports = new cache();

	
