const jwt = require("jsonwebtoken");
// const secret = process.env.JWT_SECRET;
const secret = "secret";

function signToken(data) {
    const token = jwt.sign(data, secret);
    return token;
}

function verifyToken(token) {
    const data = jwt.verify(token, secret);
    return data;
}

module.exports = {
    signToken,
    verifyToken,
};
