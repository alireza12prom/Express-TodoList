'use strict';

const { MongoClient } = require('mongodb');
// const URL = process.env.MONGO_URL;
const URL = "mongodb://127.0.0.1:27017";

const client = new MongoClient(URL, {
    connectTimeoutMS: 1000 * 10,
});


module.exports = client;