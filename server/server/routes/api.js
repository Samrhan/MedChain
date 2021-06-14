const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const mysql = require("mysql2/promise")
const fs = require('fs')
const {v4: uuidv4} = require('uuid');

let domain = process.env.DOMAIN;
let apiKey = process.env.APIKEY;
const mailgun = require('mailgun-js')({domain, apiKey, host: "api.eu.mailgun.net",})


const dotenv = require('dotenv')
dotenv.config()

const client = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: "medchain",
    password: process.env.DB_PASSWORD
});

router.post("/login", async (req, res) => require('./login.js')(req, res, client))
router.post("/disconnect", (req, res) => require('./disconnect.js')(req, res, client))
router.get("/me", async(req, res) => require('./me.js')(req, res, client))

module.exports = router
