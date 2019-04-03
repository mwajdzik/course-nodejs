const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const productsPath = path.join(rootDir, 'data', 'products.json');

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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = (Math.round(1000000 * Math.random())).toString();

        getProductsFromFile(products => {
            products.push(this);

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
};
