const userModel = require('../models/user-model');
const productModel = require('../models/product-model');
const bcrypt = require('bcrypt');
const { generatetoken } = require('../utils/generateToken');

module.exports.registerUser = async function(req, res) {
    try {
        let { fullname, email, password } = req.body;
        let user = await userModel.findOne({email: email});
        if (user) return res.status(400).send('User already exists');
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) return res.send(err.message);
                let createdUser = await userModel.create({
                    fullname,
                    email,
                    password : hash
                });
                let token = generatetoken(createdUser);
                res.cookie('token', token);
                res.send("User registered successfully");
            })
        })
    }
    catch (err) {
        res.status(500).send('Error registering user: ' + err.message);
    }
}

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({email});
    if (!user) return res.send('Email or password is incorrect');
    
    bcrypt.compare(password, user.password, async function(err, result) {
        if (result) {
            let token = generatetoken(user);
            res.cookie('token', token);
            let products = await productModel.find();
            let success = req.flash('success');
            res.render('shop', {products, success});
        } else {
            return res.send('Email or password is incorrect');
        }
    })
}

module.exports.logoutUser = function(req, res) {
    res.cookie('token', '').redirect('/');
}