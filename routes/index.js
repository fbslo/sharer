const express = require('express')
var router = express.Router()
var hive = require('@hiveio/hive-js');
const { linkPreview } = require(`link-preview-node`);
var mysql = require('mysql')
var con = require('../database/database.js')

router.get('/', (req, res) => {
	res.render('index')
})

router.get('/profile', (req, res) => {
	res.render('profile')
});

module.exports = router;
