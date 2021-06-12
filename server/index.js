require('dotenv').config()
const mysql = require('mysql2/promise');


async function main(){
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: "medchain",
        password: process.env.DB_PASS
    });

    // Syntaxes équivalentes
    const rows = await connection.query('SELECT * FROM Medecins WHERE RPPS = ?', ["00000000001"])
    console.log(rows[0])
    console.log("----------")

    const [rows2, ] = await connection.query('SELECT * FROM Medecins WHERE RPPS = ?', ["00000000001"])    // Ici on déconstruit le retour de query en ignorant le second objet qui est la liste des colonnes de la table
    console.log(rows2)
}

main()
