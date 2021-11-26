const jwt = require("jsonwebtoken")

module.exports.generateToken = (user) => {
    return jwt.sign(
        {
            id: user.dataValues.id,
            username: user.dataValues.username
        }, process.env.SECRET_KEY, { expiresIn: '15m' });
}

module.exports.generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.dataValues.id,
        }, process.env.REFRESH_KEY, { expiresIn: '15m' });
}