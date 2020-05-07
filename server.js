var hive = require('@hiveio/hive-js');
var mysql = require('mysql')
var express = require('express')
var app = express();
var bodyParser = require("body-parser");

//remove header
app.disable('x-powered-by');
//create express connection and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json

//app.use('/', require('./routes/index.js'));
//app.use('/profile', require('./routes/profile.js'));

hive.config.set('alternative_api_endpoints', ['https://api.hive.blog', 'https://anyx.io']);

var con = require('./database/database.js')
var stream = require('./scripts/streamBlockchain.js')

stream.streamBlockchain()
