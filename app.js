// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// TO DELETE
//var session = require('express-session');
var cookieParser = require('cookie-parser');

// create an express instance
const app = express();
var http = require("http").Server(app);

// initiate the socket.io server
var io = require('./services/sockets.js').listen(http);

// routes
const userRoutes = require('./routes/userRoutes.js')
const botRoutes = require('./routes/botRoutes.js')
const adminRoutes = require('./routes/adminRoutes.js')
const indexRoutes = require('./routes/indexRoutes.js')

// project classes
var database = require( './services/database.js' );

// Get environment defined variables
const http_port = process.env.PORT || 3000

// for parsing cookies on express.js
app.use(cookieParser());

// for parsing bodies in express.js
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

// for security
app.use(cors())

app.use("/css",  express.static(__dirname + '/public/css'));
app.use("/vendor", express.static(__dirname + '/public/vendor'));
app.use("/images", express.static(__dirname + '/public/images'));

// Create a connection to the database
database.connectToServer( function( err ) {
    
    if(err) {
        console.log("Error in database connection: " + err);
    } else {

        // inits the HTTP Server
        var server = http.listen(http_port, () => {
            console.log('Waiting for requests on port: ' + server.address().port)
        });

    }
});

// define routes
app.use('/', indexRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/bot', botRoutes);
