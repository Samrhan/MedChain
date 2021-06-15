const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string')
const {v4: uuidv4} = require('uuid');
const mailgun = require('mailgun-js')({domain, apiKey, host: "api.eu.mailgun.net",})

module.exports = async (req, res, client) => {

    if(req.session.userId){
        let sql;
        if(req.session.TypeID === 0){
            res.status(401).json({message: "les pharmaciens ne peuvent pas crée d'ordonnance"});
        }else{

            let Id_ordonnance = uuidv4();
            let num_secu = req.body.num_secu.toString();
            let password = cryptoRandomString({length: 12});
            let Identifiant_patient;
            let Renouvellements = req.body.renouvellements;
            let Date_maximum = req.body.date_maximum;
            let Date_prescription  = Date.now()/1000.0;
            let email  = req.body.email;
            if(num_secu== null || Identifiant_patient == null || Date_maximum == null || Renouvellements == null ){
                res.status(400).json({message: 'bad request - Missing properties'})
                return;
            }
            if(num_secu.length ==! 15){
                res.status(400).json({message: 'bad request - Error lenght password or numero de secu'})
                return;
            }
            Identifiant_patient = num_secu +password;
            await bcrypt.hash(Identifiant_patient, 10);

            sql = "INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES (?, ?, ?, ?, ?, ?)"
            await client.query(sql,[Id_ordonnance,Identifiant_patient,Renouvellements,Date_maximum,Date_prescription,req.session.userId])




            /// envoie mail patient
            //// Si non renvoie au medecin le code
            if(email && email.includes('@')){

                mailgun.messages().send({
                    from: `noreply@myvirtue.fr`,
                    to: email,
                    subject: "Telecharger votre ordonnance",
                    text: Id_ordonnance +password
                })
                res.status(200).json({message: "ok"});

            }else{
                res.status(200).json({message: "ok", code: Id_ordonnance +password});

            }

        }

    } else {
        res.status(401).json({message: "no user logged in."});
    }
}
