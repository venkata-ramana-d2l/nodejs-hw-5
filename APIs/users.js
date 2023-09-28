const crypto = require('crypto');

const extractId = require('../helpers/helpers.js');
const db = require('../db.js');

const getUserDetails = (url) => {
    const id = extractId(url);
    const user = db.find((user) => user.id === +id);
    if(user) {
        const returnUser = { ...user };
        delete returnUser.hobbies;
        return returnUser;
    } else {
        return null;
    }
}

const getAllUsers = () => db.map(user => {
    const returnUser = { ...user };
    delete returnUser.hobbies
    return returnUser;
});

const createUser = ({
    name, email, hobbies
}) => {
    const userIndex = db.findIndex(user => user.email === email);
    if (userIndex === -1) {
        const newUser = { name, email, hobbies };
        newUser['id'] = crypto.randomUUID();
        db.push(newUser);
        return {
            status: true,
            userDetails: newUser,
        }
    } else {
        return {
            status: false,
            message: 'User already exists'
        }
    }
}

const deleteUser = (url) => {
    const id = extractId(url);
    const userIndex = db.findIndex((user) => user.id === +id);
    if (userIndex > -1) {
        db.splice(userIndex, 1);
        return {
            status: true
        }
    }
    return {
        status: false
    }
}

const updateUser = (url, {name, email}) => {
    const id = extractId(url);
    const userIndex = db.findIndex((user) => user.id === +id);
    if (userIndex > -1) {
        if (name) {
            db[userIndex].name = name;
        }

        if (email) {
            db[userIndex].email = email;
        }

        return {
            status: true,
            userDetails: db[userIndex] 
        }
    } 

    return {
        status: false
    }
}


module.exports = {
    getUserDetails,
    getAllUsers,
    createUser,
    deleteUser,
    updateUser
}