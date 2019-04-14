const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    items: [{
        product: {
            type: Object,
            require: true
        },
        quantity: {
            type: Number,
            require: true
        }
    }]
});

orderSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex === -1) {
        updatedCartItems.push({productId: product._id, quantity: 1})
    } else {
        updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
    }

    this.cart.items = updatedCartItems;
    return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
