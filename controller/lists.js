const { asyncWrapper } = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');
const { 
    createNew,
    getAll, 
    getOne, 
    deleteOne, 
    updateOne } = require('../database/Lists');


const getAllLists = asyncWrapper(
    async function(request, response) {
        let lists = await getAll();
        response.status(200).json({ lists });
    }
);

const singleList = asyncWrapper(
    async function(request, response, next) {
        const { listID } = request.params;
        
        let list = await getOne(listID);
        if (!list) {
            return next(createCustomError("Task not found", 404));
        }
        response.status(200).json({ list });
    }
);

const createList = asyncWrapper( 
    async (request, response) => {
        let { name } = request.body;

        await createNew(name);
        response.status(201).end("Created")
    }
);

const deleteList = asyncWrapper(
    async function(request, response) {
        const { listID } = request.params;

        await deleteOne(listID);
        response.status(200).end('deleted');
    }
);

const updateList = asyncWrapper(
    async function(request, response) {
        const { listID } = request.params;
        let { name } = request.body;
        let items = {};

        if (name !== false) items.name = name;

        let newList = await updateOne(listID, items);
        response.status(200).json({ list:newList });
    }
);

module.exports = {
    getAllLists,
    createList,
    deleteList,
    updateList,
    singleList
}