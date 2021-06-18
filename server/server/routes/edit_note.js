// noinspection JSUnresolvedVariable,DuplicatedCode

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
    password = req.body.num_secu + password
    let data = await client.query("SELECT * FROM Ordonnances WHERE Id_ordonnance = ?", [id_ordonnance])
    let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]; // Convertir le résultat de client.query en objet manipulable
    if (data[0].length === 1) {
        if (await bcrypt.compare(password, result.Identifiant_patient)) {

            // On vérifie que cette pharmacie a déjà publié une note sur cette ordonnance
            let data2 = await client.query("SELECT * FROM notes WHERE id_ordonnance = ? AND Id_pharmacie = ? ", [id_ordonnance, req.session.pharmacie])

            if (data2[0].length === 1) {
                let sql = "UPDATE notes SET Contenu = ?, Date_ecriture = ? WHERE id_ordonnance = ? AND Id_pharmacie = ? "
                await client.query(sql, [content, Date_ecriture, id_ordonnance, req.session.pharmacie])
                res.status(200).json({message: "ok"});
            } else {
                res.status(403).json({message: "Aucune note de cette pharmacie existe"});
            }

        } else {
            res.status(400).json({message: "bad request"});
        }
    } else {
        res.status(400).json({message: "bad request"});
    }

}
