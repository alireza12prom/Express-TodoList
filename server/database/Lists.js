'use strict';

const client = require('./connect');

const DB = process.env.DB_NAME;
const Lists = client.db(DB).collection('lists');

module.exports = Lists;