const { createCustomError } = require("../errors/custom-error");
const { ObjectId } = require("mongodb");

listIDInvalidError = createCustomError('List id is not valid', 400);
taskIDInvalidError = createCustomError('Task id is not valid', 400)

const isValid = (id) => {
    return ObjectId.isValid(id);
}

const ValidateListID = function(request, response, next, id) {
    if (!isValid(id)) return next(listIDInvalidError);
    next();
}
const ValidateTaskID = function(request, response, next, id) {
    if (!isValid(id)) return next(taskIDInvalidError);
    next();
}

module.exports = { 
    ValidateListID,
    ValidateTaskID
}