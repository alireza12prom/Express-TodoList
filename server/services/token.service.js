
const jwt = require('jsonwebtoken');

class TokenService {
    constructor() {}

    createToken(payload, expiretionIn) {
        let option = {};
        
        if (expiretionIn) option.expiresIn = `${expiretionIn}d`;
        console.log(option);
        let token = jwt.sign(payload, process.env.JWT_SECRET, option);
        return token;
    }
}

module.exports = new TokenService();