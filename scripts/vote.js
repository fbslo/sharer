var hive = require('@hiveio/hive-js');
var mysql = require('mysql')

var con = require('../database/database.js')

module.exports = {
  //Vote: {"type": "vote", "voter": "fbslo", "time": "128126812", "parent_id": "fbslo-1588844637591-hivesharer"}.
  add_vote: function add_vote(data){
    json(data)
    async function json(data){
      if(data.id == 'hive_sharer'){
        let json = JSON.parse(data.json)
        if(data.required_posting_auths != json.voter){
          console.log('Account is not the same as voter!')
        } else{
          insertIntoDatabase(data, json)
          updateVoteCount(json)
        }
      }
    }

    async function updateVoteCount(json){
      var {voter, time, parent_id} = json
      con.query('SELECT votes FROM posts WHERE id = ?', [parent_id], (err, result) => {
        if(err) console.log("Error seleting votes! Error: "+err)
        else {
          let votes_old = result[0].votes
          let votes = votes_old + 1
          var values = [votes, parent_id]
          con.query('UPDATE posts SET votes = ? WHERE id = ?;', values, (err2, result2) => {
            if(err2) console.log("Error updating votes! Error: "+err2)
            else if(result) console.log("Votes updated for "+parent_id)
          })
        }
      })
    }

    async function insertIntoDatabase(data, json){
      var {voter, time, parent_id} = json
      var id = 'vote-' + voter + '-' + time + '-hivesharer'
      var values = [[voter, time, parent_id, id]]
      try {
        con.query('INSERT INTO votes (voter, time, parent_id, id) VALUES ?', [values], (err, result) => {
          if(err) console.log("Error inserting vote: "+err)
          else if (result) console.log('Vote inserted! ID: '+id)
        })
      } catch (error){
        console.log('Catching errors in /scripts/vote.js...')
      }
    }
  }
}
