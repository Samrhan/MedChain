module.exports = async (req, res, client) => {
    if (req.session.userId) {
        let sql;
        if (req.session.TypeID === 0) {
            sql = "SELECT username, nom_pharmacien, prenom_pharmacien FROM pharmaciens WHERE id_pharmacien=?"
        } else {
            sql = "SELECT RPPS, nom_medecin, prenom_medecin FROM medecins WHERE id_medecin=?"
        }
        let data = await client.query(sql, [req.session.userId])
        let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]

        if (result) {
            if (req.session.TypeID === 0) {
                result.role = "pharmacien"
            } else {
                result.role = "medecin"
            }
            res.status(200).json(result);
        } else {
            res.status(500).json({message: 'internal server error'});
        }
    } else {
        res.status(401).json({message: "no user logged in."});
    }
}
