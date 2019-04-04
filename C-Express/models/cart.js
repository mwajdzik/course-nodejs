const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const cartPath = path.join(rootDir, 'data', 'cart.json');

const getCartFromFile = (callback) => {
    fs.readFile(cartPath, (err, fileContent) => {
        if (err) {
            return callback({products: [], totalPrice: 0});
        } else {
            return callback(JSON.parse(fileContent));
        }
    });
};

module.exports = class Cart {

    static addProduct(id, price) {
        getCartFromFile(cart => {
            let product = cart.products.find(p => p.id === id);

            if (!product) {
                product = {id, qty: 0};
                cart.products.push(product);
            }

            product.qty += 1;
            product.price = +price;
            cart.totalPrice += +price;

            fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
                console.error(err);
            });
        });
    }

    static remove(id, callback) {
        getCartFromFile(cart => {
            const productIndex = cart.products.findIndex(p => p.id === id);

            if (productIndex !== -1) {
                const product = cart.products[productIndex];
                cart.products.splice(productIndex, 1);
                cart.totalPrice -= product.qty * product.price;

                fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
                    console.error(err);
                });

                callback();
            }
        });
    }
};
