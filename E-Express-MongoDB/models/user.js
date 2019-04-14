const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }]
    }
});

userSchema.methods.addToCart = function (product) {
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

userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(p => p.productId.toString() !== productId);
    return this.save();
};

userSchema.methods.clearCart = function (productId) {
    this.cart.items = [];
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
