const { ObjectId } = require("mongodb");
const { client, DB } = require("./connect");

const COLL = 'tasks';


exports.getAll = async function(listID){
    try{
        let collection = client.db(DB).collection(COLL);
        let tasks = collection.aggregate([
            {
                $match : {listID: listID}
            },
            {
                $addFields: {
                    intervalInDay: {
                        $dateDiff: {
                            startDate: '$date',
                            endDate: new Date,
                            unit: 'day'
                        }
                    }
                }
            },
            {
                $sort: {completed:1}
            }
        ]);
        return await tasks.toArray();
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
}

exports.getOne = async function(taskID){
    taskID = ObjectId(taskID);
    try{
        let collection = client.db(DB).collection(COLL);
        let result = await collection.findOne({_id:taskID});
        return result;
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
}
 
exports.updateOne = async function(taskID, fieldsToUpdate){
    taskID = ObjectId(taskID);
    let filter = {_id: taskID};
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

exports.deleteOne = async function(taskID){
    taskID = ObjectId(taskID);
    try{
        let collection = client.db(DB).collection(COLL);
        await collection.deleteOne({_id:taskID})
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
}

exports.createNew = async function(listID, name, date, completed=false){
    try{
        let collection = client.db(DB).collection(COLL);
        await collection.insertOne({listID, name, completed, date});
    } catch(error) {
        client.emit('error', error);
        throw error;
    }
} 