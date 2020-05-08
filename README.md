<h3>Hive Sharer</h3>

***Sharing links on the chain!***

---

**Abstract:**

Sharing links on Hive is controversial topic. Some people think that profiting from reqard pool by simpliy sharing links is not ok, others think it should be rewarded.

Hive Sharer is solving this problem by introducing blockhain-based link sharing platform, where users can reward each other by tipping HIVE if they like shared content.

Users can also upvote posts (upvotes don't have any monetary value), and most upvoted posts will end up on trending page.

Reward pool is not used, users can still reward their favourite sharers and people can still share links they like. Shares can earn only by providing high quality link (instead of low quality & self-voting).

---

***How does this app works? <sup>for developers & curious cats</sup>***

App is streaming blockchain and listening for `hive_sharer` custom_json operations. When they are detected, they are stored into MySQL database (for faster (offline) access, you can use HiveSQL or pure blockchain instead).

There are 3 transaction types: `post`, `comment`, `vote`

Frontend is accessing data using API at `/api/...`

---

***How does this app makes money?***

It doesn't. Only monetization is by affiliate links to exchanges where users can buy HIVE and by taking 1% fee from all tips made on our platform (sers can always send tip manually from wallet to avoid this fee.)

---

Post: `{"type": "post", "author": "fbslo", "link": "https://fbslo.net","description": "My Personal website!", "time": "128126812", "tags": "test"}`.

Votes: 0

Comments: 0

ID: `author + '-' + time + '-hivesharer'`

ID is generated before inserting operation into database (to prevent "trending" manipulation), will be moved to custom_json to support possible other frontends.

---

Vote: `{"type": "vote", "voter": "fbslo", "time": "128126812", "parent_id": "fbslo-1588844637591-hivesharer"}`.

ID: `'vote-' + author + '-' + time + '-hivesharer'`

---

Comment: `{"type": "comment", "author": "fbslo", "description": "My Personal website!", "time": "128126812", "parent_id": "fbslo-1588844637591-hivesharer"}`

ID: `'comment-' + author + '-' + time + '-hivesharer'`

---

Frontend CSS templates used:

* https://freefrontend.com/css-cards/
* Font Awesome icons
* Loading icons by https://loading.io/

3rd party libraries used:

* jQuery
* SweetAlert2
* @hiveio/hive-js
* express, body-parser, ejs
* link-preview-node
* mysql

---

Rename `/database/db_config.json.demo` to `/database/db_config.json` and edit your database details.

`Run npm install`

`Run node server.js`

---

<h3>API Documentation</h3>

`GET` `/api/profile`

Return type: `json`

On error: `success: false`

On success:
```
success: true,
username: query,
name: name,
about: about,
location: location,
profile_image: profile_image,
post_count: result[0].post_count,
following: following, //or N/A
followers: followers //or N/A
```

---

`GET` `/api/posts`

limit: 100 per page, pagination `?page=2`...

On error: `success: false`

On Success:
```
success: true
[0] background_image: string,
    profile_image: string,
    link: string,
    author: string,
    id: string,
    title: string,
    description: string,
    votes: integer,
    comments: string
...
```
