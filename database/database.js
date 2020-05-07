var mysql = require("mysql");

//Get credentials  from configuration file
var config = require('./db_config.json')
var { database_ip, database_user, database_password, database_port, database } = config

//create connection to MySQL database
var con = mysql.createConnection({
  host: database_ip,
  database: database,
  user: database_user,
  password: database_password,
  port: database_port,
  multipleStatements: true
});

function connect(){
  //connect to MySQL database
  con.connect(function(err) {
      if (err) {
        //recconect after 5 seconds on error
        console.error('Error connecting: ' + err.stack);
        setTimeout(() => {
          connect()
        }, 5000)
      }
      console.log('Connected as ID: ' + con.threadId);
  });
}

connect()

//keep the connection running
setInterval(() => {
    con.query('SELECT 1', (err, results) => {})
},5000)

module.exports = con;
