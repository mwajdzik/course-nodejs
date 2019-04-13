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

    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: productId}});
        })
        .then((products) => {
            return products[0].cartItem.destroy();
        })
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
    let fetchedCart;

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(cartProducts => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(cartProducts.map(p => {
                        p.orderItem = {quantity: p.cartItem.quantity};
                        return p;
                    }));
                })
                .catch(err => console.log(err));
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res) => {
    req.user.getOrders({include: ['products']})
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
