const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            pageTitle: 'Shop',
            prods: products,
            activeShop: true,
            hasProducts: products.length > 0
        });
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            pageTitle: 'Products',
            prods: products,
            activeProducts: true,
            hasProducts: products.length > 0
        });
    });
};

exports.getProduct = (req, res) => {
    const productId = req.params.productId;

    Product.findById(productId, product => {
        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product,
            activeProducts: true
        });
    });
};

exports.postCart = (req, res) => {
    const productId = req.body.productId;

    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getCart = (req, res) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        activeCart: true
    });
};

exports.getOrders = (req, res) => {
    res.render('shop/orders', {
        pageTitle: '',
        activeOrders: true
    });
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        activeCheckout: true
    });
};

