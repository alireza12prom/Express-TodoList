const { ObjectId } = require("mongodb");
const { client, DB } = require("./connect");
const taskClient = require('./Tasks');

const COLL = 'lists';


exports.getAll = async function() {
    try {
        let collection = client.db(DB).collection(COLL).find({}).sort({name:1});
        return await collection.toArray();
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
}

exports.getOne = async function(id){
    id = ObjectId(id);
    try{
        let collection = client.db(DB).collection(COLL);
        let result = await collection.findOne({_id:id});
        return result;
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
}
 
exports.createNew = async function(name) {
    try{
        let collection = client.db(DB).collection(COLL);
        await collection.insertOne({ name });
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
}

exports.updateOne = async function(id, fieldsToUpdate){
    id = ObjectId(id);
    let filter = {_id: id};
    let replacement = {$set: fieldsToUpdate};
    
    try{
        let collection = client.db(DB).collection(COLL);
        let { value } = await collection.findOneAndUpdate(
            filter, 
            replacement, 
            {returnDocument:'after'});
        return value;
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
} 

exports.deleteOne = async function(listID){
    try{
        let collection = client.db(DB).collection(COLL);
        await collection.deleteOne({_id:ObjectId(listID)});

        client.db(DB).collection('tasks').deleteMany({listID: listID});
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
}