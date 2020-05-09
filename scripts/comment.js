var hive = require('@hiveio/hive-js');
var mysql = require('mysql')

var con = require('../database/database.js')

var hive = require('@hiveio/hive-js');
var mysql = require('mysql')

var con = require('../database/database.js')

module.exports = {
  //Comment: {"type": "comment", "author": "fbslo", "description": "My Personal website!", "time": "128126812", "parent_id": "fbslo-1588844637591-hivesharer"}
  add_comment: function add_comment(data){
    json(data)
    async function json(data){
      if(data.id == 'hive_sharer'){
        let json = JSON.parse(data.json)
        if(data.required_posting_auths != json.author){
          console.log('Account is not the same as commenter!')
        } else{
          insertIntoDatabase(data, json)
        }
      }
    }

    async function updateCommentCount(json){
      var {author, time, parent_id} = json
      con.query('SELECT comments FROM posts WHERE id = ?', [parent_id], (err, result) => {
        if(err) console.log("Error seleting comments! Error: "+err)
        else {
          let comments_old = Number(result[0].comments)
          let comments = comments_old + 1
          var values = [comments, parent_id]
          con.query('UPDATE posts SET comments = ? WHERE id = ?;', values, (err2, result2) => {
            if(err2) console.log("Error updating comments! Error: "+err2)
            else if(result) console.log("Comments updated for "+parent_id)
          })
        }
      })
    }


    async function insertIntoDatabase(data, json){
      var {author, description, time, parent_id} = json
      var id = 'comment-' + author + '-' + time + '-hivesharer'
      var values = [[author, description, time, parent_id, id]]
      try {
        con.query('INSERT INTO comments (author, description, time, parent_id, id) VALUES ?', [values], (err, result) => {
          if(err) console.log("Error inserting comment: "+err)
          else if (result){
            updateCommentCount(json)
            console.log('Comment inserted! ID: '+id)
          }
        })
      } catch (error){
        console.log('Catching errors in /scripts/comment.js...')
      }
    }
  }
}
