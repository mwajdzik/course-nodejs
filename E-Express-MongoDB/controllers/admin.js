const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        activeAdminAddProduct: true,
        editing: false,
        product: {},
        buttonCaption: 'Add Product',
        postUrl: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = +req.body.price;
    const description = req.body.description;

    new Product(title, price, imageUrl, description, null, req.user._id)
        .save()
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
    const productId = req.params.productId;
    const editMode = !!req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    Product.findById(productId)
        .then((product) => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                activeAdminAddProduct: true,
                editing: editMode,
                product: product,
                buttonCaption: 'Edit Product',
                postUrl: '/admin/edit-product'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res) => {
    const productId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    new Product(title, price, imageUrl, description, productId, req.user._id).save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId;

    Product.remove(productId)
        .then((product) => {
            console.log('Product', productId, 'removed');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res) => {
    Product.fetchAll()
        .then((products) => {
            res.render('admin/products', {
                pageTitle: 'Admin Products',
                prods: products,
                activeAdminProducts: true,
                hasProducts: products.length > 0
            });
        })
        .catch(err => {
            console.log(err);
        });
};
