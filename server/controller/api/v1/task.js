'use strict';

const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');
const { Lists, Tasks } = require('../../../database');
const { BadRequestError } = require('../../../errors');

class TaskController {
    constructor() {}

    async getAllTask(request, response) {
        const { listId } = request.params;
        let tasks = await Tasks.aggregate([
            {
                $match: { list: listId }
            },
            {
                $set: {
                    missedDays: {
                        $dateDiff: {
                            startDate: '$date',
                            endDate: new Date(),
                            unit: "day"
                        }
                    }
                }
            }
        ]).toArray();
        console.log(tasks);
        response.status(StatusCodes.OK).json({ tasks: tasks });
    }

    async getSingleTask(request, response) {
        const { listId, taskId } = request.params;

        let task = await Tasks.aggregate([
            {
                $match: { _id: new ObjectId(taskId), list: listId }
            }, 
            {
                $set: {
                    date: {
                        $concat: [ { $toString: { $year: '$date' } }, "-", { $toString: { $month: '$date' } }, "-", { $toString: { $dayOfMonth: '$date' } }]
                    }
                }
            }
        ]).toArray();

        if (task.length) {
            response.status(StatusCodes.OK).json({ task: task[0] });
        } else {
            throw new BadRequestError("task not found");
        }
    }
    
    async createTask(request, response) {
        const { name, date } = request.body;
        const { listId } = request.params;

        let newTask = {
            name: name,
            date: date ? new Date(date) : null,
            list: new ObjectId(listId),
            completed: false
        };

        let result = await Tasks.insertOne({ ...newTask });
        response.status(StatusCodes.CREATED).json({ task: result.insertedId });
    }

    async deleteTask(request, response) {
        const { listId } = request.params;
        const { taskId } = request.body;
        console.log(listId);
        console.log(taskId);
        let result = await Tasks.findOneAndDelete({ _id: new ObjectId(taskId), list: listId });
        if (!result.value) {
            throw new BadRequestError('Task is not found');
        }

        response.status(StatusCodes.OK).json({ task: result.value });
    }

    async updateTask(request, response) {
        const { listId, taskId } = request.params;
        const { name, date, completed } = request.body;

        let filter = { 
            _id: new ObjectId(taskId), 
            list: listId,
        };

        let update = {
            date: date ? new Date(date) : null 
        };

        if (name) update.name = name;
        if (completed === true || completed === false) update.completed = completed;

        let result = await Tasks.findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after' });
        if (!result.value) {
            throw new BadRequestError('Task is not found');
        }
        
        response.status(StatusCodes.OK).json({ task: result.value });
    }
}

module.exports = new TaskController();