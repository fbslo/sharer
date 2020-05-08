var hive = require('@hiveio/hive-js');
const { linkPreview } = require(`link-preview-node`);
var mysql = require('mysql')
var con = require('../database/database.js')

module.exports = {
	update: function update(){
		con.query('SELECT * FROM posts;', (err, result) => {
				for (let i=0;i<result.length;i++){
					console.log(result[i].link)

					linkPreview(result[i].link)
						.then(resp => {
							updateLinkPreview(resp, result[i].id)
						}).catch(catchErr => {
							console.log(catchErr);
							let resp = ''
							updateLinkPreview([resp], result[i].id)
					});
			}
		})
	}
}

/*{ image: '',
  title: 'Contact Support',
  description: '',
  link: 'https://link.com' }*/


function updateLinkPreview(resp, id){
	var image = resp.image || 'N/A'
	var title = resp.title || 'N/A'
	var values = [image, title, id]
	con.query('UPDATE posts SET image_preview = ?, title_preview = ? WHERE id = ?;', values, (err, result) => {
		if(err) console.log("Error updating link preview!")
		else {
			console.log('Link updated for id: '+id)
		}
	})
}
