module.exports = async (req, res, client) => {
    req.session.destroy((err) => {
        res.status(200).send();
    });

}
