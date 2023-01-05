const { CustomError } = require("../errors/custom-error");

const errorHandler = (error, request, response, next) => {
    if (error instanceof CustomError){
        return response.status(error.status).json({ msg: error.message});
    }
    response.status(500).json({ msg: `Server Error: ${error.message}` });
}

module.exports = { errorHandler }