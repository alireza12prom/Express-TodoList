'use strict';

const client = require("./connect");

const DB = process.env.DB_NAME;
const Tasks = client.db(DB).collection('tasks')

module.exports = Tasks;