
const mysql = require("mysql2/promise")
const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const client = mysql.createPool({
    host: process.env.DB_HOST,
    user: "root",
    database: "medchain",
    password: "a"
});

let removeUser = async function (username, type) {
    if(type!= 1 && type!=0){return console.log("Erreur type")}

    if(type == 0){

        let data = await client.query("SELECT * FROM pharmaciens WHERE Username = ? ", [username])
        if (data[0].length === 1) {
            let sql = "UPDATE pharmaciens SET Droit_connexion = false WHERE Username = ? "
            await client.query(sql, [username])
            return console.log("la suppression  a ete efffectué")
        } else {
            return console.log("Aucun pharmacien n'existe")
        }

    }if(type == 1){

        let data = await client.query("SELECT * FROM medecins WHERE RPPS = ? ", [username])
        if (data[0].length === 1) {
            let sql = "UPDATE medecins SET Droit_connexion = false WHERE RPPS = ? "
            await client.query(sql, [username])
            return console.log("la suppression  a ete efffectué")
        } else {
            return console.log("Aucun medecin n'existe")
        }

    }

    return };
//node removeUser.js enzo.filangi 0
removeUser(process.argv[2],process.argv[3])
return