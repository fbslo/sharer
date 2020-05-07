Rename /database/db_config.json.demo to /database/db_config.json and edit your database details.

Run npm install
Run node server.js


How does this app works?

App is streaming blockchain and listening for custom_json operations. When they are detected, they are stored in to database (for faster access, you can use HiveSQL or pure blockchain instead). Data consists of "author", "link", "time", "tag" and "description".

Post: {"type": "post", "author": "fbslo", "link": "https://fbslo.net","description": "My Personal website!", "time": "128126812", "tags": "test"}.
Votes: 0
ID: author + '-' + time + '-hivesharer'

Vote: {"type": "vote", "voter": "fbslo", "time": "128126812", "parent_id": "fbslo-1588844637591-hivesharer"}.
ID: 'vote-' + author + '-' + time + '-hivesharer'


Comment: {"type": "comment", "author": "fbslo", "description": "My Personal website!", "time": "128126812", "parent_id": "fbslo-1588844637591-hivesharer"}
