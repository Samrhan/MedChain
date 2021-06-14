module.exports = async (req, res, client) => {
    let data = await client.query("SELECT * FROM medecins_complet")
    res.send(data)
}
