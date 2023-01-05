const URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/";
const DB = process.env.DB_NAME || "TaskManager";

const { MongoClient } = require("mongodb"); 
const client = new MongoClient(URL);

client.addListener('error', (error) => {
    console.log("/!\\ Mongodb raise an error ("+error.name+") \n *reason ("+error.message+")");
})

exports.client = client;
exports.DB = DB;