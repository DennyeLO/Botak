const jwt = require('jsonwebtoken')

exports.isAuth = (context) => {
    const auth = context.req.headers.authorization
    if (!auth) {
        throw new Error("Not Authenticated")
    }

    try {
        const token = auth.split(' ')[1]
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        context.payload = payload
    } catch (e) {
        console.log(e)
        throw new Error("Not Authenticated")
    }
}