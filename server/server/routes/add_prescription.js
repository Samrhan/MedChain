const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid');
const bwipjs = require('bwip-js');


let domain = process.env.DOMAIN;
let apiKey = process.env.APIKEY;

const mailgun = require('mailgun-js')({domain, apiKey, host: "api.eu.mailgun.net",})

module.exports = async (req, res, client) => {

    let sql;

    let Id_ordonnance = uuidv4();
    let num_secu = req.body.secu;
    let password = uuidv4();
    let Identifiant_patient;
    let Renouvellements = req.body.renewals;
    let Date_maximum = req.body.max_date;
    let Date_prescription = new Date();
    let email = req.body.patient_email;
    let prescription = req.body.prescription

    if (num_secu == null || prescription == null || Date_maximum == null || Renouvellements == null || email == null || typeof (prescription) !== "object") {
        res.status(400).json({message: 'bad request - Missing properties'})
        return;
    }
    Date_maximum = new Date(Date_maximum)
    if (num_secu.length !== 15) {
        res.status(400).json({message: 'bad request - Error numero de secu'})
        return;
    }
    // On verifie que les propriétés de tous les elements de la presccription
    for (let i = 0; i < prescription.length; i++) {
        if (prescription[i].drug_name == null || prescription[i].dose == null || prescription[i].duration == null || prescription[i].takes_per_day == null) {
            res.status(400).json({message: 'bad request - Error prescription'})
            return;
        }
    }

    Identifiant_patient = num_secu.toString() + password.toString();
    Identifiant_patient = await bcrypt.hash(Identifiant_patient, 10);

    // on insert l'ordonnance
    sql = "INSERT INTO ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES (?, ?, ?, ?, ?, ?)"
    await client.query(sql, [Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, req.session.userId])

    // On insere toutes les prescriptions
    for (let i = 0; i < prescription.length; i++) {
        sql = "INSERT INTO prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour,Id_ordonnance) VALUES (?, ?, ?, ?, ?)"
        await client.query(sql, [prescription[i].drug_name, prescription[i].dose, prescription[i].duration, prescription[i].takes_per_day, Id_ordonnance])
    }


    const png = await bwipjs.toBuffer({
        bcid: 'datamatrix',
        text: Id_ordonnance + "/" + password,
        scale: 3,
        height: 20,
    });

    let attch = new mailgun.Attachment({data: png, filename: "code.png"});
    mailgun.messages().send({
        from: `noreply@myvirtue.fr`,
        to: email,
        subject: "Telecharger votre ordonnance",
        text: "https://medchain.sbader.fr/add/"+password,
        attachment: attch
    })
    res.status(200).json({message: "ok"});


}
