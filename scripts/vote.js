var hive = require('@hiveio/hive-js');
var mysql = require('mysql')

var con = require('../database/database.js')

module.exports = {
  add_vote: function add_vote(data){
    json(data)
    async function json(data){
      if(data.id == 'hive_sharer'){
        let json = JSON.parse(data.json)
        if(data.required_posting_auths != json.voter){
          console.log('Account is not the same as voter!')
        } else{
          var values = [json.voter, json.parent_id]
          con.query('SELECT * FROM votes WHERE voter = ? AND parent_id = ?', values, (err, result) => {
            if(err) console.log("Error checking duplicated votes! Error: "+err)
            else {
              if(result.length == '0'){
                insertIntoDatabase(data, json)
              } else {
                console.log('Duplicated vote from: '+json.voter)
              }
            }
          })
        }
      }
    }

    async function updateVoteCount(parent_id){
      con.query('SELECT votes FROM posts WHERE id = ?', [parent_id], (err, result) => {
        if(err || result.length == 0) console.log("Error selecting votes! Error: "+err)
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
      var {voter, time, id, parent_id} = json
      if(!voter || !time || !id || !parent_id){
        console.log('Missing information from vote!')
      } else {
        let current_time = new Date().getTime()
        let id_voter = id.split('-')[1]
        let id_time = id.split('-')[2]
        let vote_prefix = id.split('-')[0]
        if((current_time - Number(time)) > 1000*120){
          console.log('Post is more than 2 minutes old!')
        } else if(id_voter != voter || Number(id_time) != Number(time) || vote_prefix != 'vote'){
          console.log('ID format is not correct!')
        } else {
          var values = [[voter, time, parent_id, id]]
          try {
            con.query('INSERT INTO votes (voter, time, parent_id, id) VALUES ?', [values], (err, result) => {
              if(err) console.log("Error inserting vote: "+err)
              else if (result){
                updateVoteCount(parent_id)
                console.log('Vote inserted! ID: '+id)
              }
            })
          } catch (error){
            console.log('Catching errors in /scripts/vote.js...')
          }
        }
      }
    }
  }
}
