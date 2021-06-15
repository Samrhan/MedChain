const bcrypt = require('bcrypt')


module.exports = async (req, res, client) => {

    const username = req.body.username;
    const rpps  = req.body.rpps;
    const password = req.body.password

    if (req.session.userId) {
        res.status(403).json({message: "already logged in"})
        return;
    }
    if(!((username || rpps )&& password)){
        res.status(400).json({message: "bad request - request must include username or rpps and password"});
        return;
    }
    let data;
    if(username){
        data = await client.query("SELECT * FROM pharmaciens WHERE username = ?",[username])
    }else if(rpps){
        data = await client.query("SELECT * FROM medecins WHERE rpps = ?",[rpps])
    }else{
        res.status(400).json({message: "bad request - request must include username or rpps and password"});
        return;
    }

    var result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
    if (data[0].length === 1) {
        if (await bcrypt.compare(password, result.Password)) {
            if(username){
                req.session.userId = result.Id_pharmacien;
                req.session.TypeID = 0;
            }else if(rpps){
                req.session.userId = result.Id_medecin;
                req.session.TypeID = 1;
            }
            res.status(200).json({message: "ok", id: req.session.userId})
        } else {
            res.status(400).json({message: "bad request"});
        }
}else{
        res.status(400).json({message: "bad request"});

    }

}
