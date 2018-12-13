// sockets.js
var socketio = require('socket.io');

// access to the users database
var userDB = require('../services/userDB.js');

// access to the cache
var cache = require('../services/cache.js');

var _io;

module.exports = {
    
    listen: function(server){
        _io = socketio.listen(server, {cookie: false}); //to remove io: param from cookie
		
		//if anyone connects to my socket, i will associate his socket id to his cache
        _io.sockets.on('connection', function(socket){
			console.log("user connected");
			retrieveToken(socket, function (token) {
				cache.addSocketID(token, socket.id, function (err) {if(err){return err}});  //updates cache with token
			});
 
            socket.on('message', function(data) {
                console.log("message: " + data);
				/*retrieveUser(socket, function (user) {
					//updata message -- todo
					console.log("user: " + user);
					sendToNearbyUsers(user, data, function (result) {
						//console.log(result);
					});
				});*/
            });

            socket.on('disconnect', function() {
                //console.log("byeo: " + socket.id);
            })

        })

        return _io;
    },

    // send a message to every user present in the bot's respective building
    sendMessage: function(message, building, callback) {
		sendToNearbyUsersBuilding(building, message, function (err) {callback(err)});
    },
    
    //internal functions declaration
    retrieveToken: retrieveToken,
    sendToNearbyUsersRange: sendToNearbyUsersRange,
    sendToNearbyUsersBuilding: sendToNearbyUsersBuilding,
    retrieveUser: retrieveUser,
    writeMsgToSocket: writeMsgToSocket
}

//internal functions


//isolates a token that comes with a cookie
function retrieveToken(socket, callback) {
	let result;
	let token = socket.request.headers.cookie; //'data=xxxxx'
	token = token.substr((token.indexOf('=')+1)); //removes 'data='	
	
	return callback(token)
}

//from the socket id who sent a message, gets the macthing user from the cache
function retrieveUser(socket, callback) {
	let user;
	//retrieves the token matching the cookie token
	retrieveToken(socket, function(token) {
		//from the token gets the matching user
		cache.getValue(token, function (err, result) {
			user = result.user_id;
		}); 
	});
	return callback(user);
}

//gets all users in the range of a single 'user' and writes them 'message'
function sendToNearbyUsersRange(user, message, callback) {
	userDB.listNearbyUsersByRange(user, 10000, function(users) {
		users = [{"ist_id":"ist181607"}];
		writeMsgToSocket(users, message, function () {});
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


//Writes requested 'message' to the 'users'
function writeMsgToSocket(users, message, callback) {
	
	//from the users id's, get the sockets id's
	cache.getSockets(users, function(err, sockets_list) {
		if(err) {
			return callback(err);;
		}
		// array empty or does not exist
		if (sockets_list === undefined || sockets_list.length == 0) {
			// no user in the building, so no message is sent
			console.log("No user in the building, so no message is sent.");
			// it's not considered an error
			return callback("No user in the building, so no message is sent.");;
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
