const jwt = require("jsonwebtoken");

function generatetoken(user) {
    return token = jwt.sign({email: user.email, id: user._id}, process.env.JWT_KEY);
}

module.exports.generatetoken = generatetoken;