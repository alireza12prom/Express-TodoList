const { ObjectId } = require("mongodb");
const { Lists } = require("../database");
const { BadRequestError, ForbiddenError } = require("../errors");

class ValidateParamsMiddleware {
    constructor() {}

    async verifyListId(request, response, next) {
        console.log("*** Validateing List Id ***");
        const { listId } = request.params;
        const { userId } = request.user;

        if (!ObjectId.isValid(listId)) {
            throw new BadRequestError('list id is not valid');
        }

        let list = await Lists.findOne({ _id: new ObjectId(listId) });
        if (!list || list.user.toString() !== userId.toString()) {
            throw new BadRequestError('list not found');
        } 
    
        request.params.listId = new ObjectId(listId);
        return next();
    }
}

module.exports = new ValidateParamsMiddleware();