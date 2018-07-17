//

// The auth key for the LevelUp Quest API
var auth_key = require('./authkey.js');
const PORT = 4527; // The port the server will listen on
//

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var routes = require('./routes');
app.use('/', routes);

app.listen(PORT);
console.log("Listening on port: " + PORT.toString());
