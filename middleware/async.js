const asyncWrapper = (fun) => {
    return async (request, response, next) => {
        try{
            await fun(request, response, next);
        } catch(error) {
            next(error);
        }
    }
}

module.exports = {
    asyncWrapper
}