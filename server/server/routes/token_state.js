module.exports = async (req, res, client) => {

    let id_ordonnance = req.body.id_ordonnance;
    let num_secu = req.body.num_secu;
    let password =  req.body.pwd;
    if(num_secu== null || id_ordonnance == null || password == null  ){
        res.status(400).json({message: 'bad request - Missing properties'})
        return;
    }
    password = req.body.num_secu +password
    data = await client.query("SELECT * FROM Ordonnances WHERE Id_ordonnance = ?",[Id_ordonnance])
    var result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
    if (data[0].length === 1) {
        if (await bcrypt.compare(password, result.Password)) {
            res.status(200).json({message: "ok", uses_left: result.Renouvellements, max_date :result.Date_maximum, Date_prescription: result.Date_prescription })
        } else {
            res.status(400).json({message: "bad request"});
        }
        }else{
        res.status(400).json({message: "bad request"});
    }

}
