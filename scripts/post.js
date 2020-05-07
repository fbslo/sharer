var hive = require('@hiveio/hive-js');
var mysql = require('mysql')

var con = require('../database/database.js')

module.exports = {
  //id (hive_sharer) and json {"author": "fbslo", "link": "https://fbslo.net","description": "My Personal website!", "time": "128126812", "tag": "test"}.
  add_post: function add_post(data){
    json(data)
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
      var values = [[author, link, description, time, tags, id, 0, 0]]
      try {
        con.query('INSERT INTO posts (author, link, description, time, tags, id, votes, comments) VALUES ?', [values], (err, result) => {
          if(err) console.log("Error inserting post: "+err)
          else if (result) console.log('Post inserted! ID: '+id)
        })
      } catch (error){
        console.log('Catching errors in /scripts/post.js...')
      }
    }
  }
}
