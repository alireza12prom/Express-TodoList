const { asyncWrapper } = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');
const { 
    createNew, 
    getAll, 
    getOne, 
    deleteOne, 
    updateOne } = require('../database/Tasks');

const getAllTasks = asyncWrapper(
    async function(request, response) {
        const { listID } = request.params;

        let tasks = await getAll(listID);
        response.status(200).json({ tasks });
    }
);

const createTask = asyncWrapper( 
    async (request, response) => {
        let { name, completed, date } = request.body;
        let { listID } = request.params;

        await createNew(listID, name, date, completed);
        response.status(201).end("Created")
    }
);

const singleTask = asyncWrapper(
    async function(request, response, next) {
        const { taskID } = request.params;

        let task = await getOne(taskID);
        if (!task) {
            return next(createCustomError("Task not found", 404));
        }
        response.status(200).json({ task });
    }
);

const deleteTask = asyncWrapper(
    async function(request, response) {
        const { taskID } = request.params;
        await deleteOne(taskID);
        response.status(200).end('deleted');
    }
);

const updateTask = asyncWrapper(
    async function(request, response) {
        const { taskID } = request.params;
        let { name, completed, date } = request.body;
        let passedFields = {};

        if (name !== false) passedFields.name = name;
        if (completed !== null) passedFields.completed = completed;
        if (date !== false) passedFields.date = date;

        let newTask = await updateOne(taskID, passedFields);
        response.status(200).json({ task:newTask });
    }
);

module.exports = {
    getAllTasks,
    createTask,
    singleTask,
    deleteTask,
    updateTask
}