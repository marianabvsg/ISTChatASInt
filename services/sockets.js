// sockets.js
var socketio = require('socket.io');

// access to the users database
var userDB = require('../services/userDB.js');

// access to the cache
var cache = require('../services/cache.js');

var _io;

module.exports = {
    
    listen: function(server){
        _io = socketio.listen(server);

        _io.sockets.on('connection', function(socket){
            //console.log("heyo: " + socket.id);

            socket.on('message', function(data) {
                console.log("message: " + data);
                console.log("cookie: " + socket.request.headers.cookie);
            })

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

            if (err) {
                console.log(err);
                callback(err);
            }

            // from the users list get the list of their respective socket.id
            cache.getSockets(users, function(err, sockets_list) {

                if(err) {
                    console.log(err);
                    callback(err);;
                }

                // array empty or does not exist
                if (sockets_list === undefined || sockets_list.length == 0) {
                    
                    // no user in the building, so no message is sent
                    console.log("No user in the building, so no message is sent.");

                    // it's not considered an error
                    callback(null);;
                } else {
                    
                    // send message to all the users in the message
                    for (socketId in sockets_list) {
                        // sending to individual socketid (private message)
                        _io.to(`${socketId}`).emit('message', message);
                    }

                    // no error detected
                    callback(null);;
                }
            })
        });
    }
}
