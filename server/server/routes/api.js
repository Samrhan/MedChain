const express = require('express')
const router = express.Router()
const mysql = require("mysql2/promise")


const dotenv = require('dotenv')
dotenv.config()

const client = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: "medchain",
    password: process.env.DB_PASSWORD
});

/**
 * Middleware pour vérifier  l'utilisateur
 */
var right_to_pharmacist = async function (req, res, next) {
    if (req.session.TypeID === 0) {
        next()
    } else {
        res.status(401).json({message: "Vous ne pouvez pas utiliser cette route"}).send();
    }
}
var right_to_doctor = async function (req, res, next) {
    if (req.session.TypeID === 1) {
        next()
    } else {
        res.status(401).json({message: "Vous ne pouvez pas utiliser cette route"}).send();
    }
}


router.post("/login", async (req, res) => require('./login.js')(req, res, client))
router.post("/disconnect", (req, res) => require('./disconnect.js')(req, res, client))
router.get("/me", async (req, res) => require('./me.js')(req, res, client))
router.post("/add_prescription", right_to_doctor, async (req, res) => require('./add_prescription.js')(req, res, client))
router.post("/token_state", async (req, res) => require('./token_state.js')(req, res, client))
router.post("/get_prescription", right_to_pharmacist, async (req, res) => require('./get_prescription.js')(req, res, client))
router.post("/use_prescription", right_to_pharmacist, async (req, res) => require('./use_prescription.js')(req, res, client))
router.post("/note", right_to_pharmacist, async (req, res) => require('./note.js')(req, res, client))
router.patch("/note", right_to_pharmacist, async (req, res) => require('./edit_note.js')(req, res, client))
module.exports = router
