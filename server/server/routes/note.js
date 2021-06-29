// noinspection DuplicatedCode,JSUnresolvedVariable

const bcrypt = require('bcrypt')



module.exports = async (req, res, client) => {

    let id_ordonnance = req.body.token;
    let num_secu = req.body.secu;
    let password = req.body.password;
    let content = req.body.content;
    let Date_ecriture = new Date();

    if (num_secu == null || id_ordonnance == null || password == null || content == null) {
        res.status(400).json({message: 'bad request - Missing properties'})
        return;
    }
    password = num_secu + password
    let data = await client.query("SELECT * FROM Ordonnances WHERE Id_ordonnance = ?", [id_ordonnance])
    let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
    if (data[0].length === 1) {

        if (await bcrypt.compare(password, result.Identifiant_patient)) {
            let data2 = await client.query("SELECT * FROM notes WHERE id_ordonnance = ? AND Id_pharmacie = ?  AND Utilise = false", [id_ordonnance,parseInt(req.session.pharmacie)])
            let result2 = Object.values(JSON.parse(JSON.stringify(data2[0])))

            if(result2.length===1){
                        res.status(403).json({message: 'Une note de cette pharmacie existe deja'})
                        return;

            }

            let sql = "INSERT INTO notes(Id_ordonnance, Id_pharmacie, Contenu, Date_ecriture, Utilise) VALUES (?, ?, ?,?,?)"
                await client.query(sql, [id_ordonnance, req.session.pharmacie, content, Date_ecriture, false])
                res.status(200).json({message: "ok"});


        } else {
            res.status(400).json({message: "bad request"});
        }
    } else {
        res.status(400).json({message: "bad request"});
    }
}
