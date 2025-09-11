const express = require('express');
const router = express.Router();
const isLoggedin = require('../middlewares/isLoggedin');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get('/', (req, res) => {
    let error = req.flash('error');
    res.render('index', {error, loggedin: false});
});

router.get('/shop', isLoggedin, async (req, res) => {
    let products = await productModel.find();
    let success = req.flash('success');
    res.render('shop', {products, success});
});

router.get('/addtocart/:productId', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productId);
    await user.save();
    req.flash('success', 'Product added to cart');
    res.redirect('/shop');
});

router.get('/cart', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}).populate('cart');
    res.render('cart', {user});
});

module.exports = router;