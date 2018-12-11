// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// routes
const userRoutes = require('./routes/userRoutes.js')
const botRoutes = require('./routes/botRoutes.js')
const adminRoutes = require('./routes/adminRoutes.js')
const indexRoutes = require('./routes/indexRoutes.js')

// classes
var database = require( './services/database.js' );

// Get environment defined variables
const http_port = process.env.PORT || 3000

const app = express();

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use(cors())

// TO DELETE
app.use(session({secret: "mysecretkey"}));

// Create a connection to the database
database.connectToServer( function( err ) {
    if(err) {
        console.log("Error in database connection: " + err);
    } else {

        // Launch API server            
        app.listen(http_port, function() {
            console.log('Waiting for requests on port: ' + http_port)
        })
    }
});

// define routes
app.use('/', indexRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/bot', botRoutes);
