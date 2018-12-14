// sockets.js
var socketio = require('socket.io');

// access to the users database
var userDB = require('../services/userDB.js');

// access to the cache
var cache = require('../services/cache.js');

var _io;

//internal functions

function retrieveToken(socket, callback) {
	let result;
	let token = socket.request.headers.cookie; //'data=xxxxx'
	token = token.substr((token.indexOf('=')+1)); //removes 'data='	
	cache.addSocketID(token, socket.id, function (err, suc) { //updates cache with token
		result = suc;
	});
	
	return callback(token)
}

function retrieveUser(socket, callback) {
	let user;
	retrieveToken(socket, function(token) {
		cache.getValue(token, function (err, result) {
			console.log("rs: " + result);
			user = result.user_id;
		}); 
	});
	return callback(user);
}

function sendToNearbyUsers(user , callback) {
	let users;
	userDB.listNearbyUsersByRange(user, function(err, users) {
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
                    
                    // send message to all the users in the message
                    for (socketID in sockets_list) {
                        // sending to individual socketid (private message)
                        _io.to(sockets_list[socketID]).emit('message', message);
                    }

                    // no error detected
                    return callback(null);;
                }
            });
	});
	
	return callback(usersArray);
}


module.exports = {
    
    listen: function(server){
        _io = socketio.listen(server, {cookie: false}); //to remove io: param from cookie

        _io.sockets.on('connection', function(socket){
			console.log("user connected");
			retrieveToken(socket, function (suc) {});
            
            socket.on('message', function(data) {
                console.log("message: " + data);
               /* retrieveUser(socket, function (user) {
					//updata message -- todo
					console.log(user);
					sendToNearbyUsers(user, function (result) {
						console.log(result);
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

        // get a list of the users that are in the bot's building
        userDB.listByBuilding(building, function(err, users) {
            if (err || users == undefined || users.length == 0) {

                if(err == null) {
                    return callback("No user inside the building you're trying to send to.");
                } else {
                    return callback(err);
                }
                
            }
            // from the users list get the list of their respective socket.id
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
                    
                    // send message to all the users in the message
                    for (socketID in sockets_list) {
                        // sending to individual socketid (private message)
                        _io.to(sockets_list[socketID]).emit('message', message);
                    }

                    // no error detected
                    return callback(null);;
                }
            });
        });
    },
    retrieveToken: retrieveToken,
    sendToNearbyUsers: sendToNearbyUsers,
    retrieveUser: retrieveUser
}