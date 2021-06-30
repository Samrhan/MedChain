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
    password = num_secu + password
    let data = await client.query("SELECT * FROM Ordonnances WHERE Id_ordonnance = ?", [id_ordonnance])
    let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
    if (data[0].length === 1) {

        if (await bcrypt.compare(password, result.Identifiant_patient)) {

            let data2 = await client.query("SELECT * FROM utilisations_ordonnance WHERE id_ordonnance = ?", [id_ordonnance])
            let result2 = Object.values(JSON.parse(JSON.stringify(data2[0])))[0]
            if (result2 === undefined) {
                let renouvellement_restant = result.Renouvellements

                res.status(200).json({
                    uses_left: renouvellement_restant,
                    max_date: result.Date_maximum,
                    Date_prescription: result.Date_prescription
                })

            } else {
                let renouvellement_restant = result2.Renouvellements - result2.Utilisations

                res.status(200).json({
                    uses_left: renouvellement_restant,
                    max_date: result.Date_maximum,
                    Date_prescription: result.Date_prescription
                })
            }


        } else {
            res.status(400).json({message: "bad request"});
        }
    } else {
        res.status(400).json({message: "bad request"});
    }

}
