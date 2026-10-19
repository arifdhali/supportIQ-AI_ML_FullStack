const jwt = require("jsonwebtoken");
const Authorization = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        throw new Error("Authorization header is missing");
    }

    let token = header.split(" ")[1];
    if (!token) {
        throw new Error("Token is missing");
    }

    let decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decode)

    next();
}
module.exports = Authorization;