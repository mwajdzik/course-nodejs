const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const productsPath = path.join(rootDir, 'data', 'products.json');

const Cart = require('./cart');

const getProductsFromFile = (callback) => {
    fs.readFile(productsPath, (err, fileContent) => {
        if (err) {
            return callback([]);
        } else {
            return callback(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {

    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const productIndex = products.findIndex(p => p.id === this.id);
                products[productIndex] = this;
            } else {
                this.id = (Math.round(1000000 * Math.random())).toString();
                products.push(this);
            }

            fs.writeFile(productsPath, JSON.stringify(products), (err) => {
                console.error(err);
            });
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback)
    }

    static findById(id, callback) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            callback(product);
        })
    }

    static remove(id, callback) {
        getProductsFromFile(products => {
            const productIndex = products.findIndex(p => p.id === id);
            const product = products[productIndex];
            products.splice(productIndex, 1);

            fs.writeFile(productsPath, JSON.stringify(products), (err) => {
                if (!err) {
                    Cart.remove(product.id, () => {
                        callback();
                    });
                } else {
                    console.error(err);
                }
            });
        });
    }
};
