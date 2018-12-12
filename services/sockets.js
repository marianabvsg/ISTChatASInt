// sockets.js
var socketio = require('socket.io');

var _io;

module.exports = {
    
    listen: function(server){
        _io = socketio.listen(server, {cookie: false});

        _io.sockets.on('connection', function(socket){

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

    getIO: function() {
        return _io;
    }
}
