const bcrypt = require('bcrypt')

module.exports = async (req, res, client) => {

    let id_ordonnance = req.body.token;
    let num_secu = req.body.secu;
    let password = req.body.password;
    let Date_delivrance = new Date();
    let fully_used = req.body.fully_used;

    if (num_secu == null || id_ordonnance == null || password == null || (fully_used !== false && fully_used !== true)) {
        res.status(400).json({message: 'bad request - Missing properties'})

    }
    password = num_secu + password
    let data = await client.query("SELECT * FROM Ordonnances WHERE Id_ordonnance = ?", [id_ordonnance])
    let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
    if (data[0].length === 1) {
        if (await bcrypt.compare(password, result.Identifiant_patient)) {
            let data2 = await client.query("SELECT * FROM utilisations_ordonnance WHERE id_ordonnance = ?", [id_ordonnance])
            let result2 = Object.values(JSON.parse(JSON.stringify(data2[0])))[0]
            if ((result2.Renouvellements - result2.Utilisations) < 1) {

                res.status(403).json({message: "bad request - l'ordonnance a trop de fois ete utilisée"});
                return;
            }

            let sql = "INSERT INTO delivre(Id_ordonnance, Id_pharmacien, Date_delivrance,Delivre_en_entier) VALUES (?, ?, ?,?)"
            await client.query(sql, [id_ordonnance, req.session.userId, Date_delivrance, fully_used])
            let sql2 = "UPDATE notes SET Utilise = True WHERE id_ordonnance = ? AND Id_pharmacie = ? AND Utilise = False "
            await client.query(sql2, [id_ordonnance, req.session.pharmacie])
            res.status(200).json({message: "ok"});


        } else {
            res.status(400).json({message: "bad request"});
        }
    } else {
        res.status(400).json({message: "bad request"});
    }
}
