const express = require('express');
const router = express.Router();

const admin = require('./admin');

router.get('/', (req, res, next) => {
    res.render('shop', {
        pageTitle: 'Shop',
        prods: admin.products,
        activeShop: true,
        hasProducts: admin.products.length > 0
    });
});

module.exports = router;
