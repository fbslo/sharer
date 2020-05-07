var hive = require('@hiveio/hive-js');
var mysql = require('mysql')

var con = require('../database/database.js')

module.exports = {
  streamBlockchain: //stream all operations
  async function streamBlockchain(){
    hive.api.streamTransactions('head', async function(err, result) {
      if (err){
        restart()
        console.log("Error scanning blockchain: "+err)
      } else{
        try {
          let type = result.operations[0][0]
          let data = result.operations[0][1]
          if(type == 'custom_json'){
            json(data)
          }
        } catch (err) {
          restart()
          console.log("Error scanning blockchain: "+err)
        }
      }
    });
    function restart(){
      setTimeout(() => {
        streamBlockchain()
      }, 5000)
    }
  }
}

//id (hive_sharer) and json {"author": "fbslo", "link": "https://fbslo.net","description": "My Personal website!", "time": "128126812", "tag": "test"}.
async function json(data){
  if(data.id == 'hive_sharer'){
    let json = JSON.parse(data.json)
    if(data.required_posting_auths != json.author){
      console.log('Author is not the same as poster!')
    } else{
      insertIntoDatabase(data, json)
    }
  }
}

async function insertIntoDatabase(data, json){
  var {author, link, description, time, tags} = json
  var id = author + '-' + time + '-hivesharer'
  var values = [[author, link, description, time, tags, id, 0]]
  con.query('INSERT INTO posts (author, link, description, time, tags, id, votes) VALUES ?', [values], (err, result) => {
    console.log(err, result)
  })
}
