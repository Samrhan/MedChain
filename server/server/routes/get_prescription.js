// noinspection DuplicatedCode

const bcrypt = require('bcrypt')

module.exports = async (req, res, client) => {

    let id_ordonnance = req.body.token;
    let num_secu = req.body.secu;
    let password = req.body.password;
    if (num_secu == null || id_ordonnance == null || password == null) {
        res.status(400).json({message: 'bad request - Missing properties'})
        return;
    }
    password = req.body.num_secu + password
    let data = await client.query("SELECT * FROM Ordonnances WHERE Id_ordonnance = ?", [id_ordonnance])
    let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0] // Convertir le résultat de client.query en objet manipulable
    if (data[0].length === 1) {

        if (await bcrypt.compare(password, result.Identifiant_patient)) {

            // On récupère l'ordonnance
            let info_ordonnance_sql = await client.query("SELECT * FROM info_ordonnance WHERE Id_ordonnance = ?", [id_ordonnance])
            let info_ordonnance = Object.values(JSON.parse(JSON.stringify(info_ordonnance_sql[0])))[0]
            // On supprime l'id de l'ordonnance du retour
            delete info_ordonnance.Id_ordonnance
            // On récupère toutes les prescriptions associées à l'ordonnance
            let prescription_sql = await client.query("SELECT * FROM prescriptions WHERE Id_ordonnance = ?", [id_ordonnance])
            let prescription = Object.values(JSON.parse(JSON.stringify(prescription_sql[0])))
            // On récupère les notes associées à l'ordonnance
            let notes_sql = await client.query("SELECT * FROM notes WHERE Id_ordonnance = ?", [id_ordonnance])
            let notes = Object.values(JSON.parse(JSON.stringify(notes_sql[0])))
            res.status(200).json({
                info_ordonnance: info_ordonnance,
                prescription: prescription,
                notes: notes
            })


        } else {
            res.status(400).json({message: "bad request"});
        }
    } else {
        res.status(400).json({message: "bad request"});
    }


}
