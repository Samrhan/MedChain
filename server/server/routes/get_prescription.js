// noinspection DuplicatedCode

const bcrypt = require('bcrypt')

module.exports = async (req, res, client) => {

    let id_ordonnance = req.body.id_ordonnance;
    let num_secu = req.body.num_secu;
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
            let data2 = await client.query("SELECT * FROM info_ordonnance WHERE Id_ordonnance = ?", [id_ordonnance])
            let info_ordonnance = Object.values(JSON.parse(JSON.stringify(data2[0])))[0]
            // On supprime l'id de l'ordonnance du retour
            delete info_ordonnance.Id_ordonnance
            // On récupère toutes les prescriptions associées à l'ordonnance
            let data3 = await client.query("SELECT * FROM prescriptions WHERE Id_ordonnance = ?", [id_ordonnance])
            let prescription = Object.values(JSON.parse(JSON.stringify(data3[0])))
            // On récupère les notes associées à l'ordonnance
            let data4 = await client.query("SELECT * FROM notes WHERE Id_ordonnance = ?", [id_ordonnance])
            let notes = Object.values(JSON.parse(JSON.stringify(data4[0])))
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
