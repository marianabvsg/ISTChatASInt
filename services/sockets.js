// sockets.js
var socketio = require('socket.io');

// access to the users database
var userDB = require('../services/userDB.js');
var logsDB = require('../services/logsDB.js');

// access to the cache
var cache = require('../services/cache.js');

var _io;


module.exports = {
    
    listen: function(server){
        _io = socketio.listen(server, {cookie: false}); //to remove io: param from cookie
		
		//if anyone connects to my socket, i will associate his socket id to his cache
        _io.sockets.on('connection', function(socket){
			console.log("socket connected");
			if(socket.request.headers.cookie != null) { //socket has a cookie if authenticated
				retrieveTokenFromCookie(socket, function (token) {
					cache.addSocketID(token, socket.id, function (err) {if(err){return err}});  //updates cache with token
				});
			}
			//cache.printCache(function (err) {});
			
			//message received in socket
            socket.on('message', function(data) {
                console.log("message: " + data);
                
                //from the socket id to the cache, gets the user id
				retrieveUserFromSocketID(socket, function (user) {

					if(user == undefined) {return} //intruder alert

					console.log("user: " + user);

					// create a message with the data to send and the sender id
					var message = {
						'user': user,
						'data': data
					}
					
					//sends messages to all users in range
					sendToNearbyUsersRange(user, message, function (response, destination) {
						
						//destination is a json vector of ist_id to add to the log
						//response is empty if no users in range or error if error happened
						if(response) {console.log(response, destination);}
						
						//extract users from the json objects and creates new log
						getUsersVector(destination, function (usersVector) {
							//get the source building to add to the log
							userDB.getBuilding(user, function(building) {
								//if(building != null) {
								//log insert
								logsDB.insertMessage(user, data, building, usersVector, function(err) {
									if(err) {console.log("InserMessage in sockets: " + err)}
								})
							})
						});
						
					});

				});
            });

            socket.on('disconnect', function() {
                console.log("socket disconnected");
            })

        })

        return _io;
    },

    // send a message to every user present in the bot's respective building
    sendMessage: function(message, building, callback) {
		sendToNearbyUsersBuilding(building, message, function (err) {callback(err)});
    },
    
    //internal functions declaration
    retrieveTokenFromCookie: retrieveTokenFromCookie,
    sendToNearbyUsersRange: sendToNearbyUsersRange,
    sendToNearbyUsersBuilding: sendToNearbyUsersBuilding,
    retrieveUserFromSocketID: retrieveUserFromSocketID,
    writeMsgToSocket: writeMsgToSocket,
    getUsersVector : getUsersVector
}

//internal functions

//from an array of json object of type [{ist_id:istxxxx}, ..]
//creates a vector of type [istxxxx, istxxx...]
//returns [] if empty
function getUsersVector(dest, callback) {
	var usersVector = [];
	if(dest != null) {
		for (i in dest) {
			//update vector
			usersVector.push(dest[i].ist_id)
		}
	}
	callback(usersVector)
}


//isolates the token that comes with a cookie
//cookies is: data=token
function retrieveTokenFromCookie(socket, callback) {
	let result;
	let token = socket.request.headers.cookie; //'data=xxxxx'
	token = token.substr((token.indexOf('=')+1)); //removes 'data='	
	
	return callback(token)
}

//from the socket id who sent a message, gets the macthing user from the cache
function retrieveUserFromSocketID(socket, callback) {
	let user;
	//retrieves the token matching the cookie token
	retrieveTokenFromCookie(socket, function(token) {
		//from the token gets the matching user
		cache.getUserID(token, function (err, result) {
			user = result;
		}); 
	});
	return callback(user);
}

//gets all users in the range of a single 'user' and writes them 'message'
function sendToNearbyUsersRange(user, message, callback) {
	//get range of the source user
	userDB.getRange(user, function (res) {
		//get users in source user's range
		userDB.listNearbyUsersByRange(user, Number(res.range), function(err, usersInRange) {
			//write to users in range
			writeMsgToSocket(usersInRange, message, function (err) {
				callback(err, usersInRange);
			});
		});
	});
}

//get all users in 'building' and writes them 'message'
function sendToNearbyUsersBuilding(building, message, callback) {
	// get a list of the users that are in the bot's building
	userDB.listByBuilding(building, function(err, users) {
		if (err || users == undefined || users.length == 0) {
			if(err == null) {
				return callback("No user inside the building you're trying to send to.");
			} else {
				return callback(err);
			}
		}
		//write the message to the sockets matching the users
		writeMsgToSocket(users, message, function (err) {callback(err)});    
	});
}


//Writes requested 'message' to all 'users'
function writeMsgToSocket(users, message, callback) {
	
	//from the users id's, get the sockets id's
	cache.getSockets(users, function(err, sockets_list) {
		if(err) {
			return callback(err);;
		}
		// array empty or does not exist
		if (sockets_list === undefined || sockets_list.length == 0) {
			// no user in the building, so no message is sent
			// it's not considered an error
			return callback("No logged in user in range or building, so no message is sent");;
		} else {
			// send message to all the users requested in arg
			for (socketID in sockets_list) {
				// sending to individual socketid (private message)
				_io.to(sockets_list[socketID]).emit('message', message);
			}

			// no error detected
			return callback(null);;
		}
	});
}
