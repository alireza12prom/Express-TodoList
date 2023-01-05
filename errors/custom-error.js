
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const createCustomError = (msg, statusCode) => {
    return new CustomError(msg, statusCode);
}

module.exports = { createCustomError, CustomError }