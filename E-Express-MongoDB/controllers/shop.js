const Product = require('../models/product');

exports.getIndex = (req, res) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                prods: products,
                activeShop: true,
                hasProducts: products.length > 0
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/product-list', {
                pageTitle: 'Products',
                prods: products,
                activeProducts: true,
                hasProducts: products.length > 0
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res) => {
    const productId = req.params.productId;
    console.debug("req.body.productId=", productId);

    Product.findById(productId)
        .then((product) => {
            console.debug("Found product", JSON.stringify(product));

            res.render('shop/product-detail', {
                pageTitle: product.title,
                product: product,
                activeProducts: true
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res) => {
    const productId = req.body.productId;
    console.debug("req.body.productId=", productId);

    Product.findById(productId)
        .then(product => {
            console.debug("Found product", JSON.stringify(product));
            return req.user.addToCart(product);
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res) => {
    const productId = req.body.productId;
    console.debug("req.body.productId=", productId);

    req.user.deleteItemFromCart(productId)
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
    req.user.getCart()
        .then(cartProducts => {
            res.render('shop/cart', {
                pageTitle: 'Cart',
                activeCart: true,
                cartProducts: cartProducts,
                hasProducts: cartProducts.length > 0
            });
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
    req.user.addOrder()
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: '',
                activeOrders: true,
                orders: orders,
                hasOrders: orders.length > 0
            });
        })
        .catch(err => console.log(err));
};
