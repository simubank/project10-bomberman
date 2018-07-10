//

// The auth key for the LevelUp Quest API
var auth_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiMjgxMzgyMSIsImV4cCI6OTIyMzM3MjAzNjg1NDc3NSwiYXBwX2lkIjoiNDMzY2JkMTMtMTNmNC00ZWFlLTg1ZmUtN2RkOGNlMmJkNGVhIn0.AeY8PVB5r3pKBPf52APbmQWWweg0vY_78wBkoZNmkmE';
const PORT = 3000; // The port the server will listen on
//

var express = require('express');
var app = express();

var routes = require('./router');
app.use('/', routes);

app.listen(PORT);
