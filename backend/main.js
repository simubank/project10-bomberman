//

// The auth key for the LevelUp Quest API
var auth_key = '';
const PORT = 3000; // The port the server will listen on
//

var express = require('express');
var app = express();

var routes = require('./router');
app.use('/', routes);

app.listen(PORT);
