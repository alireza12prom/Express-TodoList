'use strict';

const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');
const { Lists, Tasks } = require('../../../database');
const { BadRequestError } = require('../../../errors');


class ListController {
    constructor() {}

    async getAllLists(request, response) {
        const { userId } = request.user;

        let lists = await Lists.find({ user: userId }).toArray();
        console.log(lists);
        response.status(StatusCodes.OK).json({ lists });
    }

    async getSingleList(request, response) {
        const { listId } = request.params;
        const { userId } = request.user;
    
        let list = await Lists.findOne({ _id: new ObjectId(listId), user: userId });
        if (!list) {
            throw new BadRequestError('Task not found');
        }
        response.status(StatusCodes.OK).json({ list });
    }

    async createList(request, response) {
        const { name } = request.body;
        const { userId } = request.user;

        let newList = {
            name: name,
            user: userId 
        };

        let result = await Lists.insertOne({...newList}, { checkKeys:true });
        response.status(StatusCodes.CREATED).json({ list: result.insertedId });
    }

    async deleteList(request, response) {
        const { listId } = request.body;
        const { userId } = request.user;

        let result = await Lists.findOneAndDelete({ _id: new ObjectId(listId), user: userId });
        if (result.value) {
            Tasks.deleteMany({list: new ObjectId(listId)});
            response.status(200).json({ list: result.value });
        } else {
            throw new BadRequestError('List not found');
        }
    }

    async updateList(request, response) {
        const { userId } = request.user;
        const { listId } = request.params;
        const { name } = request.body;

        let filter = { _id: new ObjectId(listId), user: userId };
        let newList = await Lists.findOneAndUpdate(filter, { $set: { name: name }}, { returnDocument: 'after' });
        
        if (!newList.value) {
            throw new BadRequestError('list not found');
        }
        response.status(200).json({ list:newList.value });
    }
}


module.exports = new ListController();