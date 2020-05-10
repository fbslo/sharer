var hive = require('@hiveio/hive-js');
var mysql = require('mysql')
const { linkPreview } = require('link-preview-node')
var xss = require("xss");

var con = require('../database/database.js')

module.exports = {
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
      var {author, link, description, time, tags, id} = json
      if(!author || !link || !description || !time || !tags || !id){
        console.log('Missing information from post!')
      } else {
        let current_time = new Date().getTime()
        let id_author = id.split('-')[0]
        let id_time = id.split('-')[1]
        if((current_time - Number(time)) > 1000*120){
          console.log('Post is more than 2 minutes old!')
        } else if(id_author != author || Number(id_time) != Number(time)){
          console.log('ID format is not correct!')
        }
        else {
          var author = xss(author)
          var link = xss(link);
          var description = xss(description);
          var tags = xss(tags);

          var values = [[author, link, description, time, tags, id, 0, 0]]
          try {
            con.query('INSERT INTO posts (author, link, description, time, tags, id, votes, comments) VALUES ?', [values], (err, result) => {
              if(err) console.log("Error inserting post: "+err)
              else if (result) console.log('Post inserted! ID: '+id)
              updateLinkPreview(json, id)
            })
          } catch (error){
            console.log('Catching errors in /scripts/post.js...')
          }
        }
      }
    }
  }
}

function updateLinkPreview(json, id){
  var {author, link, description, time, tags} = json
  linkPreview(link)
    .then(resp => {
      updateLinkPreviewDatabase(resp, id)
    }).catch(catchErr => {
      console.log(catchErr);
      let resp = ''
      updateLinkPreviewDatabase([resp], id)
  });
}

function updateLinkPreviewDatabase(resp, id){
	var image = resp.image || 'N/A'
	var title = resp.title || 'N/A'
	var values = [image, title, id]
	con.query('UPDATE posts SET image_preview = ?, title_preview = ? WHERE id = ?;', values, (err, result) => {
		if(err || result.length == 0) console.log("Error updating link preview!")
		else {
			console.log('Link updated for id: '+id)
		}
	})
}
