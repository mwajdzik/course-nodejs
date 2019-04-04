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
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();

    res.redirect('/');
};

exports.getEditProduct = (req, res) => {
    const productId = req.params.productId;
    const editMode = !!req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    Product.findById(productId, product => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            activeAdminAddProduct: true,
            editing: editMode,
            product: product,
            buttonCaption: 'Edit Product',
            postUrl: '/admin/edit-product'
        });
    });
};

exports.postEditProduct = (req, res) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(id, title, imageUrl, description, price);
    product.save();

    res.redirect('/');
};

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.productId;

    Product.remove(productId, () => {
        res.redirect('/');
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            prods: products,
            activeAdminProducts: true,
            hasProducts: products.length > 0
        });
    });
};
