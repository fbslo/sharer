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

app.use('/', require('./routes/index.js'));
app.use('/api', require('./routes/api.js'));


hive.config.set('alternative_api_endpoints', ['https://anyx.io', 'https://api.hive.blog', 'https://api.pharesim.me', 'https://rpc.ausbit.dev', 'https://hived.privex.io', 'https://api.openhive.network', 'https://techcoderx.com', 'https://rpc.esteem.app']);

var con = require('./database/database.js')
var stream = require('./scripts/streamBlockchain.js')

stream.streamBlockchain()

app.listen(5000)
