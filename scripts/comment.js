var hive = require('@hiveio/hive-js');
var mysql = require('mysql')
var xss = require("xss");

var con = require('../database/database.js')

var hive = require('@hiveio/hive-js');
var mysql = require('mysql')

var con = require('../database/database.js')

module.exports = {
  add_comment: function add_comment(data){
    json(data)
    async function json(data){
      if(data.id == 'hive_sharer'){
        let json = JSON.parse(data.json)
        if(data.required_posting_auths != json.author){
          console.log('Account is not the same as commenter!')
        } else{
          var values = [json.author, json.id]
          con.query('SELECT * FROM comments WHERE author = ? AND id = ?', values, (err, result) => {
            if(err) console.log('Error checking for duplicate posts!')
            else {
              if(result.length == '0'){
                console.log('Post is duplicated! ID: ' + json.id)
              } else {
                insertIntoDatabase(data, json)
              }
            }
          })
        }
      }
    }

    async function updateCommentCount(json){
      var {author, time, parent_id} = json
      con.query('SELECT comments FROM posts WHERE id = ?', [parent_id], (err, result) => {
        if(err || result.length == 0) console.log("Error seleting comments! Error: "+err)
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
      var {author, description, time, parent_id, id} = json
      if(!author || !description || !time || !parent_id || !id){
        console.log('Missing information from comment!')
      } else {
        let current_time = new Date().getTime()
        let id_author = id.split('-')[1]
        let id_time = id.split('-')[2]
        let comment_prefix = id.split('-')[0]
        if((current_time - Number(time)) > 1000*120){
          console.log('Post is more than 2 minutes old!')
        } else if(id_author != author || Number(id_time) != Number(time) || comment_prefix != 'comment'){
          console.log('ID format is not correct!')
        }
        else {
          var author = xss(author)
          var link = xss(link);
          var description = xss(description);

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
  }
}
