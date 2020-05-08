const express = require('express')
var router = express.Router()
var hive = require('@hiveio/hive-js');
const { linkPreview } = require(`link-preview-node`);
var mysql = require('mysql')
var con = require('../database/database.js')

router.get('/posts', (req, res) => {
	var page = req.query.page || 1
	if(page < 0){
		page = 1
	}
	var limit = (page-1)*100
	con.query('SELECT * FROM posts LIMIT 100 OFFSET ?;', limit, (err1, result1) => {
		var html = ''
		var count = 0
		if(err1 || result1.length == 0){
			console.log("Error getting api index page: "+err1)
			res.json({
        success: false
      })
		}
		else{
			for (let i=0;i<result1.length;i++){
        var posts = []
				hive.api.getAccounts([result1[i].author], async function(err, result) {
					if(err) {
            res.json({success: false})
          }
					let metadata = result[0].posting_json_metadata || result[0].json_metadata
					let json = JSON.parse(metadata)
					var {name, profile_image} = json.profile
          posts.push({
            background_image: result1[i].image_preview,
            profile_image: profile_image,
						time: result1[i].time,
            link: result1[i].link,
            author: result1[i].author,
            id: result1[i].id,
            title: result1[i].title_preview,
            description: result1[i].description,
            votes: result1[i].votes,
            comments: result1[i].comments
          })
					count += 1
					if(count == result1.length){
            res.json(posts)
					}
				});
			}
		}
	})
})


router.get('/profile', (req, res) => {
	var query = req.query.account || 'fbslo'
	hive.api.getAccounts([query], async function(err, result) {
		if(err){
      var json_err = {
        success: false
      }
      res.json(json_err)
    }
		let metadata = result[0].posting_json_metadata || result[0].json_metadata
		let json = JSON.parse(metadata)
		var {name, about, location, profile_image} = json.profile
		hive.api.getFollowCount(query, function(err2, result2) {
	  	if(err2) {
        var json = {
          success: true,
          username: query,
          name: name,
          about: about,
          location: location,
          profile_image: profile_image,
          post_count: result[0].post_count,
          following: 'N/A',
          followers: 'N/A'
        }
        res.json(json)
      }
			if(result2){
				let followers = result2.follower_count
				let following = result2.following_count
				var json = {
          success: true,
					username: query,
					name: name,
					about: about,
					location: location,
					profile_image: profile_image,
					post_count: result[0].post_count,
					following: following,
					followers: followers
				}
        res.json(json)
			}
		});
	});
})



module.exports = router;
