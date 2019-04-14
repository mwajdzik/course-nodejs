const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

/*
https://mongodb.github.io/node-mongodb-native/api-generated/collection.html#

If using MongoDB directly:

*/

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://localhost:27017/nodecomplete', {useNewUrlParser: true})
        .then((clent) => {
            _db = clent.db();
            callback(clent);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }

    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
