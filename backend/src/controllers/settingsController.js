function getSettings(req, res, next) {
    res.json( {
        email: 'igor@gmail.com'
    });
}

module.exports = { getSettings }