const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
    Product.find()
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
    Product.find()
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

    req.user.removeFromCart(productId)
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const cartProducts = user.cart.items.map(p => {
                return {
                    _id: p.productId._id,
                    title: p.productId.title,
                    quantity: p.quantity
                }
            });

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
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(p => {
                return {
                    quantity: p.quantity,
                    product: {...p.productId._doc}
                }
            });

            const order = new Order({
                userId: req.user._id,
                items: products
            });

            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res) => {
    Order.find({userId: req.user._id})
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
