'use strict';

const client = require('./connect');

const DB = process.env.DB_NAME;
const Users = client.db(DB).collection('users');

(async () => {
    await Users.createIndex('email', { unique:true });
})();


module.exports = Users;