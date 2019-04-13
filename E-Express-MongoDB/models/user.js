const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

module.exports = class User {

    constructor(id, username, email, cart) {
        this.email = email;
        this.username = username;
        this.cart = cart;
        this._id = new mongodb.ObjectId(id);
    }

    save() {
        const collection = getDb().collection('users');
        return collection.insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex === -1) {
            updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: 1})
        } else {
            updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
        }

        return getDb().collection('users')
            .updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: {cart: {items: updatedCartItems}}}
            )
    }

    getCart() {
        return getDb().collection('products')
            .find({_id: {$in: this.cart.items.map(i => i.productId)}})
            .toArray()
            .then(products => {
                return products.map(p => {
                    const cartItem = this.cart.items.find(i => i.productId.toString() === p._id.toString());
                    return {...p, quantity: cartItem.quantity}
                });
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(p => p.productId.toString() !== productId);

        return getDb().collection('users')
            .updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: {cart: {items: updatedCartItems}}}
            )
    }

    addOrder() {
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: new mongodb.ObjectId(this._id),
                    name: this.username
                }
            };

            return getDb().collection('orders')
                .insertOne(order)
                .then(() => {
                    this.cart = {items: []};

                    return getDb().collection('users')
                        .updateOne(
                            {_id: new mongodb.ObjectId(this._id)},
                            {$set: {cart: {items: []}}}
                        );
                });
        });
    }

    getOrders() {
        return getDb().collection('orders')
            .find({'user._id': new mongodb.ObjectId(this._id)})
            .toArray();
    }

    static findById(id) {
        return getDb().collection('users')
            .find({_id: new mongodb.ObjectId(id)})
            .next()
            .then(user => new User(user._id, user.username, user.email, user.cart))
    }
};
