// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const csp = require('helmet-csp');
var session = require('express-session');

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

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use(cors())

app.use(session({secret: "mysecretkey"}));

// app.use(csp({
//     // Specify directives as normal.
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["*"]
//     },
   
//     // This module will detect common mistakes in your directives and throw errors
//     // if it finds any. To disable this, enable "loose mode".
//     loose: false,
   
//     // Set to true if you only want browsers to report errors, not block them.
//     // You may also set this to a function(req, res) in order to decide dynamically
//     // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
//     reportOnly: false
//   }))

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
