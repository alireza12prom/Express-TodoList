const bcrypt = require('bcryptjs');
const { Users } = require('../database');


const register = async function(request, response, next) {
    const { name, email, password } = request.body;

    const newUser = {
        name: name,
        email: email,
        password: bcrypt.hashSync(password)
    }

    let result = await Users.insertOne({ ...newUser });
    
    newUser._id = result.insertedId;
    request.user = newUser;
    next();
}

module.exports = register;