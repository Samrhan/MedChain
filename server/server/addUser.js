
const mysql = require("mysql2/promise")
const bcrypt = require('bcrypt')

const dotenv = require('dotenv')
dotenv.config()

const client = mysql.createPool({
    host: process.env.DB_HOST,
    user: "root",
    database: "medchain",
    password: "a"
});

let addUser = async function (argv) {
    let username =argv[2]
    let password =argv[3]
    let type =argv[4]
    let nom =argv[5]
    let prenom =argv[6]
    let numero =argv[7]
    let rue =argv[8]
    let ville =argv[9]
    let codepostal =argv[10]
    let telephone =argv[11]



    if(type!= 1 && type!=0){return console.log("Erreur type")}

    password = await bcrypt.hash(password, 10)

    if(type == 0){
        const regex = new RegExp('[A-Za-z]*([.])[A-Za-z]*');
        if(!regex.test(username)){return console.log("Erreur username")}
        let idpharmacie =argv[12]

        let data = await client.query("SELECT * FROM pharmaciens WHERE Username = ? ", [username])
        if (data[0].length === 1) {

            return console.log("Un pharmacien existe deja")
        } else {
            let sql = "INSERT INTO pharmaciens (Nom_pharmacien,Prenom_pharmacien,Numero,Rue,Ville,CodePostal,Telephone,Password,Username,Id_pharmacie)  VALUES (?, ?, ?, ?, ?, ?,?,?,?,?)"
            await client.query(sql, [nom,prenom,numero,rue,ville,codepostal,telephone,password,username,idpharmacie])
            return console.log("l'ajout  a ete efffectué")
        }


    }else if(type == 1){
        const regex = new RegExp('[0-9]{11}');
        if(!regex.test(username)){return console.log("Erreur username")}

        let specialite =argv[12]
        let data = await client.query("SELECT * FROM medecins WHERE RPPS = ? ", [username])
        if (data[0].length === 1) {
            return console.log("Un medecin existe deja")
        } else {
            let data = await client.query("SELECT * FROM specialites WHERE Specialite = ? ", [specialite])
            if (data[0].length !== 1) {
                return console.log("La specialité n'existe pas")
            } else {
                let sql = "INSERT INTO medecins (Nom_medecin,Prenom_medecin,Numero,Rue,Ville,CodePostal,Telephone,RPPS,Password,Specialite)  VALUES (?, ?, ?, ?, ?, ?,?,?,?,?)"
                await client.query(sql, [nom,prenom,numero,rue,ville,codepostal,telephone,username,password,specialite])
                return console.log("l'ajout  a ete efffectué")
            }

        }

    }

    return };
//node addUser.js 12345678912 1234 1 adri gigi 1 zz zz 00 0000 Généraliste

addUser(process.argv)
return