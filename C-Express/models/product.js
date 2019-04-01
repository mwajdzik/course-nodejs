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
}

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
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
};
