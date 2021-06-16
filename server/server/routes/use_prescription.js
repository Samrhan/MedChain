const bcrypt = require('bcrypt')

module.exports = async (req, res, client) => {

    let id_ordonnance = req.body.id_ordonnance;
    let num_secu = req.body.num_secu;
    let password = req.body.password;
    let Date_delivrance = new Date();

    if (num_secu == null || id_ordonnance == null || password == null) {
        res.status(400).json({message: 'bad request - Missing properties'})

    }
    password = req.body.num_secu + password
    data = await client.query("SELECT * FROM Ordonnances WHERE Id_ordonnance = ?", [id_ordonnance])
    var result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
    if (data[0].length === 1) {
        if (await bcrypt.compare(password, result.Identifiant_patient)) {
            data2 = await client.query("SELECT * FROM utilisations_ordonnance WHERE id_ordonnance = ?", [id_ordonnance])
            var result2 = Object.values(JSON.parse(JSON.stringify(data2[0])))[0]

            if ((result2.Renouvellements - result2.Utilisations) < 1) {
                res.status(403).json({message: "bad request - l'ordonnance a trop de fois ete utilisé"});
                return;
            }
            sql = "INSERT INTO delivre(Id_ordonnance, Id_pharmacien, Date_delivrance) VALUES (?, ?, ?)"
            const result = await client.query(sql, [id_ordonnance, req.session.userId, Date_delivrance])

            res.status(200).json({message: "ok"});

        } else {
            res.status(400).json({message: "bad request"});
        }
    } else {
        res.status(400).json({message: "bad request"});
    }


}
