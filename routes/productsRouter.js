const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.get('/', function(req, res) {
    res.send('Product');
});

router.post('/create', upload.single('image'), async function(req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
        let image = req.file.buffer;
        let product = await productModel.create({
            image,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });
        req.flash('success', 'Product created successfully!');
        res.redirect('/owner/admin');
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;