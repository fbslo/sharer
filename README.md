Rename /database/db_config.json.demo to /database/db_config.json and edit your database details.

Run npm install
Run node server.js


How does this app works?

App is streaming blockchain and listening for custom_json operations. When they are detected, they are stored in to database (for faster access, you can use HiveSQL or pure blockchain instead). Data consists of "author", "link", "time", "tag" and "description".
