const bcrypt = require('bcrypt')

module.exports = async (req, res, client) => {

    if(req.session.userId){
        let sql;
        if(req.session.TypeID === 0){
            res.status(401).json({message: "les pharmaciens ne peuvent pas crée d'ordonnance"});
        }else{

            let Id_ordonnance;
            let num_secu = req.body.num_secu.toString();
            let password = req.body.pwd.toString();
            let Identifiant_patient =req.body.identifiant_patient;
            let Renouvellements = req.body.renouvellements;
            let Date_maximum = req.body.date_maximum;
            let Date_prescription  = Date.now()/1000.0;
            if(num_secu== null || password == null || Identifiant_patient == null || Date_maximum == null || Renouvellements == null ){
                res.status(400).json({message: 'bad request - Missing properties'})
                return;
            }
            if(num_secu.length ==! 15 || password.length ==! 12){
                res.status(400).json({message: 'bad request - Error lenght password or numero de secu'})
                return;
            }
            Id_ordonnance = num_secu +password;
            await bcrypt.hash(Id_ordonnance, 10);

            sql = "INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES (?, ?, ?, ?, ?, ?)"
            await client.query(sql,[Id_ordonnance,Identifiant_patient,Renouvellements,Date_maximum,Date_prescription,req.session.userId])

        }

    } else {
        res.status(401).json({message: "no user logged in."});
    }
}
