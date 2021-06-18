// noinspection JSUnresolvedVariable

const bcrypt = require('bcrypt')

module.exports = async (req, res, client) => {

    const username = req.body.username
    const password = req.body.password
    const user_type = parseInt(req.body.user_type)

    if (req.session.userId) {
        res.status(403).json({message: "already logged in"})
        return;
    }
    if (!(username && password && user_type !== undefined)) {
        res.status(400).json({message: "bad request - request must include username, user_type and password"});
        return;
    }
    let data;
    if (user_type === 0) {
        data = await client.query("SELECT * FROM pharmaciens WHERE username = ?", [username])
    } else if (user_type === 1) {
        data = await client.query("SELECT * FROM medecins WHERE rpps = ?", [username])
    } else {
        res.status(400).json({message: "bad request - request must include username,user_type  and password"});
        return;
    }
    let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
    if (data[0].length === 1) {
        if (result.Droit_connexion) {

            if (await bcrypt.compare(password, result.Password)) {

                if (user_type === 0) {
                    req.session.userId = result.Id_pharmacien;
                    req.session.TypeID = 0;
                    req.session.pharmacie = result.Id_pharmacie;
                } else if (user_type === 1) {
                    req.session.userId = result.Id_medecin;
                    req.session.TypeID = 1;
                }
                res.status(200).json({message: "ok", id: req.session.userId})
            } else {
                res.status(401).json({message: "bad request"});
            }
        } else {
            res.status(403).json({message: "You can't connect anymore"});
        }

    } else {
        res.status(403).json({message: "bad request"});
    }
}
