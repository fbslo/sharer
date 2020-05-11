<center><h3>Hive Sharer</h3></center>

<center>***Sharing links on the chain!***</center>

---

**Abstract:**

Sharing links on Hive is controversial topic. Some people think that profiting from reward pool by simpliy sharing links is not ok, others think it should be rewarded. Post that motivated me to think about this more, was https://peakd.com/hivewatchers/@demotruk/copy-and-paste-is-not-the-same-as-spam-or-plagiarism by @demotruk.

Hive Sharer is solving this problem by introducing blockhain-based link sharing platform, where users can reward each other by tipping HIVE if they like shared content.

Users can also upvote posts (upvotes don't have any monetary value), and most upvoted posts will end up on trending page.

Reward pool is not used, users can still reward their favourite sharers and people can still share links they like. Sharers can earn only by providing high quality links (solving the problem of low quality content & self-voting).

---

***How to use the site***

You must have Hive Keychain installed to vote, comment, post or tip. Get it for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/hive-keychain/) or [Chrome](https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep).

When you visit the site for the first time, you must enter your hive username. Your username is than stored into your browser's local storage and used with KeyChain when you try to vote, comment, post... If you used wrong username, click [change username] in the footer.

To visit user's profile, click on "Account" button and enter hive username or click on author's name in the post (or click the user's avatar).

To share new link, click "Share" button, enter link, description and one tag (sorting by tag is not available yet).

---


***How does this app works? <sup>for developers & curious cats</sup>***

App is streaming blockchain and listening for custom_json operations with id `hive_sharer`. When they are detected, they are stored into MySQL database (for faster (offline) access, you can use HiveSQL or pure blockchain instead to build frontend for HiveSharer).

There are 3 transaction types: `post`, `comment`, `vote`

Frontend is accessing data using API at `/api/...` (more API documentation bellow.)

---

***JSON operations***

New post:

```
var time = new Date().getTime() //unix_timestamp * 1000
var id_post = 'fbslo' + '-' + time + '-hivesharer' //author-time-hivesharer

post = `{
  "type": "post",
  "author": "fbslo",
  "link": "https://fbslo.net",
  "description": "My personal website!",
  "time": "${time}",
  "tags": "dev",
  "id": "${id_post}"
}`
```
---

New vote:

```
var time = new Date().getTime()
var id_vote = 'vote-fbslo' + '-' + time + '-hivesharer'

vote = `{
  "type": "vote",
  "voter": "fbslo",
  "time": "${time}",
  "id": "${id_vote}",
  "parent_id": "fbslo-1589046191432-hivesharer"
}`
```

---

New comment:

```
var time = new Date().getTime()
var id_comment = 'comment-fbslo' + '-' + time + '-hivesharer'

var comment = `{
  "type": "comment",
  "author": "fbslo",
  "description": "Great Website!",
  "time": "${time}",
  "parent_id": "fbslo-1589046191432-hivesharer",
  "id": "${id_comment}"
}`
```

---

Frontend CSS templates used:

* https://codepen.io/JavaScriptJunkie/pen/jvRGZy by Muhammed Erdem (used for profile page)
* https://codepen.io/TSUmari/pen/WmXGgo by Tsumari (used for new/trending page)
* Font Awesome icons
* Loading icons by https://loading.io/

3rd party libraries used:

Frontend:
* jQuery
* SweetAlert2
* Moment.js

Backend:
* @hiveio/hive-js
* express, body-parser, ejs
* link-preview-node
* mysql
* xss


---

***How to set up your own dApp***

Clone github repository and install MySQL database.

Database schema:

* database name: `sharer`
* Tables:

```
Table name: posts
+---------------+---------+------+-----+---------+-------+
| Field         | Type    | Null | Key | Default | Extra |
+---------------+---------+------+-----+---------+-------+
| author        | text    | YES  |     | NULL    |       |
| link          | text    | YES  |     | NULL    |       |
| description   | text    | YES  |     | NULL    |       |
| time          | text    | YES  |     | NULL    |       |
| tags          | text    | YES  |     | NULL    |       |
| id            | text    | YES  |     | NULL    |       |
| votes         | int(11) | YES  |     | NULL    |       |
| comments      | text    | YES  |     | NULL    |       |
| image_preview | text    | YES  |     | NULL    |       |
| title_preview | text    | YES  |     | NULL    |       |
+---------------+---------+------+-----+---------+-------+

Table name: comments
+-------------+------+------+-----+---------+-------+
| Field       | Type | Null | Key | Default | Extra |
+-------------+------+------+-----+---------+-------+
| author      | text | YES  |     | NULL    |       |
| description | text | YES  |     | NULL    |       |
| time        | text | YES  |     | NULL    |       |
| parent_id   | text | YES  |     | NULL    |       |
| id          | text | YES  |     | NULL    |       |
+-------------+------+------+-----+---------+-------+

Table name: votes
+-----------+------+------+-----+---------+-------+
| Field     | Type | Null | Key | Default | Extra |
+-----------+------+------+-----+---------+-------+
| voter     | text | YES  |     | NULL    |       |
| time      | text | YES  |     | NULL    |       |
| parent_id | text | YES  |     | NULL    |       |
| id        | text | YES  |     | NULL    |       |
+-----------+------+------+-----+---------+-------+
```

(Instructions on how to install NodeJS, NPM and MySQL: https://gist.github.com/fbslo/b63bab4c9e7cfc09e5b613fbe4715937)

Rename `/database/db_config.json.demo` to `/database/db_config.json` and edit your database details.

Run `npm install`

Run `node server.js`

---

***Trending Algorithm***

To sort trending page, I used score calculated from number of votes and post age.

`let score = votes / Math.pow(post_age_days, 0.6)`

![image.png](https://images.hive.blog/DQmf5qQ7gH1NRd5KNhYg9Focne5farasehDNDWR3QWMRUpu/image.png)
<sup>Example for post with 1000 votes.</sup>

---

<h3>API Documentation</h3>

`GET` `/api/profile`

Api parameters: `account` (default is fbslo)

Example: `/api/profile?account=fbslo`

Return type: `json`

On error: `success: false`

On success:
```
success: true,
username: username,
name: name,
about: about,
location: location,
profile_image: profile_image,
post_count: number_of_posts_on_hive,
following: number_of_following_on_hive, //or N/A
followers: number_of_followers_on_hive //or N/A
```

---

`GET` `/api/posts`

Api parameters: `page` (default is 1)

Limit: 10 per page

Example: `/api/posts?page=2`

Return type: `json`

On error: `success: false`

On Success:
```
success: true
[0] background_image: image_from_website,
    profile_image: author's_profile_image,
    link: webpage_link,
    author: author_username,
    id: post_id,
    title: title_from_web_page,
    description: description_by_author,
    votes: number_of_votes, //int
    comments: number_of_comments //string
...
```

---

`GET` `/api/comments`

Api parameters:  `id`

Example: `/api/comments?id=fbslo-1589046191432-hivesharer`

Return type: `json`

On error: `success: false`

On Success:
```
success: true
[0] parent_id: parent_post_id,
    author: author's_username,
    id: comment_id,
    description: comment_body,
    time: time_in_(unix_timestamp * 1000)
...
```

---

`GET` `/api/accountposts`

Api parameters:  `account` (default is fbslo)

Example: `/api/accountposts?account=fbslo`

Return type: `json`

On error: `success: false`

On Success:
```
success: true
[0] time: time_in_(unix_timestamp * 1000),
    link: website_link,
    author: author_username,
    id: post_id,
    title: title_from_web_page,
    description: description_by_author,
    votes: number_of_votes, //int
    comments: number_of_comments //string
...
```
