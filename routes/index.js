const express = require('express')
var router = express.Router()
var hive = require('@hiveio/hive-js');
const { linkPreview } = require(`link-preview-node`);
var mysql = require('mysql')
var con = require('../database/database.js')

router.get('/', (req, res) => {
	var page = req.query.page || 1
	if(page < 0){
		page = 1
	}
	getPosts(page)
	function display(html){
		res.render('index', {
			display: html
		})
	}
	function getPosts(page){
		var limit = (page-1)*10
		con.query('SELECT * FROM posts LIMIT 10 OFFSET ?;', limit, (err1, result1) => {
			var html = ''
			var count = 0
			if(err1 || result1.length == 0){
				console.log("Error getting index page: "+err1)
				res.send('Error, please try again later.')
			}
			else{
				for (let i=0;i<result1.length;i++){
					hive.api.getAccounts([result1[i].author], async function(err, result) {
						if(err) console.log('error getting content')
						let metadata = result[0].posting_json_metadata || result[0].json_metadata
						let json = JSON.parse(metadata)
						var {name, profile_image} = json.profile
						console.log(result1[i].link)

						linkPreview(result1[i].link)
							.then(resp => {
								console.log(resp.image)
									html += `<div class="plx-card silver">
										<div class="pxc-bg" style="background-image:url('${resp.image}')"></div>
										<div class="pxc-avatar"><img src="${profile_image}" /></div>
										<div class="pxc-subcard">
												<div class="pxc-title"><i class="fas fa-hand-holding-usd fa-border" onclick='tip("${resp.link}", "${result1[i].author}")'></i> <i class="fas fa-arrow-up fa-border" onclick=submitVote("${result1[i].id}")></i> ${resp.title}</div>
												<div class="pxc-sub">${result1[i].description}</div>
											<div class="bottom-row">
												<a href='${resp.link}' class='button1'>${resp.link}</a>  &nbsp - ${result1[i].votes} Votes - ${result1[i].comments} Comments
											</div>
										</div>
									</div>`
									count += 1
									console.log(count)
									if(count == result1.length){
										display(html)
										console.log('display')
									}
							}).catch(catchErr => {
									console.log(catchErr);
						});
					});
				}
			}
		})
	}
})




router.get('/profile', (req, res) => {
	var query = req.query.account || 'fbslo'
	hive.api.getAccounts([query], async function(err, result) {
		if(err) res.send('This account does not exists (or node error)! Try again later.')
		let metadata = result[0].posting_json_metadata || result[0].json_metadata
		let json = JSON.parse(metadata)
		var {name, about, location, profile_image} = json.profile
		hive.api.getFollowCount(query, function(err2, result2) {
	  	if(err2) retry(query)
			if(result2){
				let followers = result2.follower_count
				let following = result2.following_count
				res.render('profile', {
					username: query,
					name: name,
					about: about,
					location: location,
					profile_image: profile_image,
					post_count: result[0].post_count,
					following: following,
					followers: followers
				})
			}
		});
	});
	function retry(query){
		res.redirect('/profile');
	}
})



module.exports = router;
