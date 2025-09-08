const express = require('express');
const router = express.Router();

const ownerModel = require('../models/owner-model');

if (process.env.NODE_ENV === 'development') {
    router.post('/create', async function(req, res) {
        let owner = await ownerModel.find();
        if (owner.length > 0) {
            return res.status(500).send('Owner already exists');
        }
        let { fullname, email, password } = req.body;
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password
        });
        res.send(createdOwner);
    });
}

router.get('/', function(req, res) {
    res.send('Owner');
});

module.exports = router;