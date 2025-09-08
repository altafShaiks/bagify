const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function isLoggedin(req, res, next) {
    if (!req.cookies.token) {
        req.flash('error', 'You must be logged in to view this page');
        return res.redirect('/');
    }
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({email: decoded.email}).select('-password');
        req.user = user;
        next();
    } catch (err) {
        req.flash('error', 'Something went wrong.');
        res.redirect('/');
    }
};