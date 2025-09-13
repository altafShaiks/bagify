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
    let item = user.cart.find(item => item.productDetails == req.params.productId);
    if (item) {
        item.quantity += 1;
    } else {
        user.cart.push({
            productDetails: req.params.productId,
            quantity: 1
        });
    }
    await user.save();
    req.flash('success', 'Product added to cart');
    res.redirect(req.get('referer'));
});

router.get('/cart', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}).populate('cart.productDetails');
    res.render('cart', {user});
});

router.get('/removefromcart/:productId', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}).populate('cart');
    let item = user.cart.filter(item => item.productDetails == req.params.productId);
    if (item) {
        item[0].quantity -= 1;
    }
    await user.save();
    res.redirect('/cart');
});

module.exports = router;