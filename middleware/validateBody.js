const { createCustomError } = require("../errors/custom-error");

const nameInvalidError = createCustomError('the `name` must be a non-empty string (length < 13)', 400);
const completedInvalidError = createCustomError('the `completed` must be a boolean', 400);
const dateInvalidError = createCustomError('the `date` must be a string in formats [yyyy-mmm-dd] or [mm/dd/yyyy] (year > 2018)', 400);

const validateNameField = (name) => {
    if (typeof name !== 'string' || name === '' || name.length > 12) {
        return false;
    } 
    return true
}
const validateCompletedField = (completed) => {
    if (typeof completed !== 'boolean') {
        return false;
    }
    return true;
}

// validate form: [mm/dd/yyyy] or [yyyy-mmm-dd]
const validateDateField = (date) => {
    let mm_dd_yyy_1 = /^\d{1,2}-\d{1,2}-\d{4}$/;
    let mm_dd_yyy_2 = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    let yyyy_mm_dd_1 = /^\d{1,2}-\d{1,2}-\d{4}$/;
    let yyyy_mm_dd_2 = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    
    let regs = [mm_dd_yyy_1, mm_dd_yyy_2, yyyy_mm_dd_1, yyyy_mm_dd_2];
    if (regs.some((reg) => reg.test(date)))
        return false;

    // if there is / in date, `new Date(date)` converts its to local time 
    if (mm_dd_yyy_2.test(date) || yyyy_mm_dd_2.test(date)) {
        date = date.replaceAll("/", "-");
    } 

    if (new Date(date) == 'Invalid Date')
        return false;
    
    if (new Date(date).getFullYear() < 2019)
        return false;
    
    return true;
}

const validateBodyOnCreateTask= function(request, response, next) {
    let { name, completed, date } = request.body;

    if (!validateNameField(name)) {
        return next(nameInvalidError);
    }

    if (typeof completed === 'undefined') request.body.completed = false;
    else if (!validateCompletedField(completed)) {
        return next(completedInvalidError);
    }

    if (typeof date === 'undefined' || date === '') request.body.date = null;
    else if (!validateDateField(date)){
        return next(dateInvalidError);
    } else {
        request.body.date = new Date(date);
    }
    next();
}

const validateBodyOnUpdateTask = function(request, response, next) {
    let { name, completed, date } = request.body;

    if (typeof name === 'undefined') request.body.name = false;
    else if (!validateNameField(name)) {
        return next(nameInvalidError);
    }

    if (typeof completed === 'undefined') request.body.completed = null;
    else if (!validateCompletedField(completed)) {
        return next(completedInvalidError);
    }

    if (typeof date === 'undefined') request.body.date = false;
    else if (date == '') request.body.date = null;
    else if (!validateDateField(date)){
        return next(dateInvalidError);
    } else {
        request.body.date = new Date(date);
    }
    next();
}

const validateBodyOnCreateList = function(request, response, next) {
    let { name } = request.body;

    if (!validateNameField(name)) {
        return next(nameInvalidError);
    }
    next();
}

const validateBodyOnUpdateList = function(request, response, next) {
    let { name } = request.body;

    if (typeof name === 'undefined' || name == '') request.body.name = false;
    else if (!validateNameField(name)){
        return next(nameInvalidError);
    }
    next();
}

module.exports = {
    validateBodyOnCreateTask,
    validateBodyOnUpdateTask,
    validateBodyOnCreateList,
    validateBodyOnUpdateList
};
