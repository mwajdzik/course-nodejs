const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

module.exports = class User {

    constructor(username, email) {
        this.email = email;
        this.username = username;
    }

    save() {
        const collection = getDb().collection('users');
        return collection.insertOne(this);
    }

    static findById(id) {
        return getDb().collection('users')
            .find({_id: new mongodb.ObjectId(id)})
            .next();
    }
};
