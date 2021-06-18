// noinspection JSUnresolvedVariable

const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid');


let domain = process.env.DOMAIN;
let apiKey = process.env.APIKEY;

const mailgun = require('mailgun-js')({domain, apiKey, host: "api.eu.mailgun.net",})

module.exports = async (req, res, client) => {

    let sql;

    let Id_ordonnance = uuidv4();
    let num_secu = req.body.num_secu;
    let password = Math.random().toString().substr(2, 12);
    let Identifiant_patient;
    let Renouvellements = req.body.renewals;
    let Date_maximum = req.body.max_date;
    let Date_prescription = new Date();
    let email = req.body.patient_email;
    let prescription = JSON.parse(req.body.prescription)

    if (num_secu == null || prescription == null || Date_maximum == null || Renouvellements == null || email == null) {
        res.status(400).json({message: 'bad request - Missing properties'})
        return;
    }
    if (num_secu.length !== 15) {
        res.status(400).json({message: 'bad request - Error numero de secu'})
        return;
    }
    for (let i = 0; i < prescription.length; i++) {
        if (prescription[i].drug_name == null || prescription[i].dose == null || prescription[i].duration == null || prescription[i].takes_per_day == null) {
            res.status(400).json({message: 'bad request - Error prescription'})
            return;
        }
    }

    Identifiant_patient = num_secu.toString() + password.toString();
    await bcrypt.hash(Identifiant_patient, 10);

    sql = "INSERT INTO ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES (?, ?, ?, ?, ?, ?)"
    await client.query(sql, [Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, req.session.userId])

    for (let i = 0; i < prescription.length; i++) {
        sql = "INSERT INTO prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour,Id_ordonnance) VALUES (?, ?, ?, ?, ?)"
        await client.query(sql, [prescription[i].drug_name, prescription[i].dose, prescription[i].duration, prescription[i].takes_per_day, Id_ordonnance])
    }

    mailgun.messages().send({
        from: `noreply@myvirtue.fr`,
        to: email,
        subject: "Telecharger votre ordonnance",
        text: Id_ordonnance + "\n" + num_secu + password
    })
    res.status(200).json({message: "ok"});


}
