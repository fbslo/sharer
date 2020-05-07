var hive = require('@hiveio/hive-js');
var mysql = require('mysql')

var con = require('../database/database.js')

var post = require('./post.js')
var vote = require('./vote.js')
var comment = require('./comment.js')

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
          if(type == 'custom_json' && data.id == 'hive_sharer'){
            let json = JSON.parse(data.json)
            if(json.type == 'post') post.add_post(data)
            else if(json.type == 'comment') comment.add_comment(data)
            else if(json.type == 'vote') vote.add_vote(data)
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
