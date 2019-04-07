const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

module.exports = class Product {

    constructor(title, price, imageUrl, description, id) {
        this._id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        const collection = getDb().collection('products');

        if (this._id) {
            const newProduct = {...this};
            delete newProduct._id;

            return collection.updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: newProduct}
            );
        } else {
            return collection.insertOne(this);
        }
    }

    static fetchAll() {
        return getDb().collection('products')
            .find()
            .toArray();
    }

    static findById(id) {
        return getDb().collection('products')
            .find({_id: new mongodb.ObjectId(id)})
            .next();
    }

    static remove(id) {
        console.log(id);
        return getDb().collection('products')
            .remove({_id: new mongodb.ObjectId(id)});
    }
};
