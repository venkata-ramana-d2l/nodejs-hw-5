
let db = require('../db');
const extractId = require("../helpers/helpers");

const addHobby = ({ userId, hobby }) => {
    const userIndex = db.findIndex((user) => user.id === +userId);
    if (userIndex > -1) {
        db[userIndex].hobbies.push(hobby);
        return {
            status: true
        };
    }
    return {
        status: false
    };
}

const deleteHobby = ({ userId, hobby }) => {
    const userIndex = db.findIndex((user) => user.id === +userId);
    if (userIndex > -1) {
        const hobbyIndex = db[userIndex].hobbies.findIndex(h => h === hobby);
        if (hobbyIndex > -1) {
            db[userIndex].hobbies.splice(hobbyIndex, 1);
            return {
                status: true
            };
        }
        return {
            status: false,
            message: 'Hobby not found'
        };
    }
    return {
        status: false,
        message: 'User not found'
    }
}

const listHobbies = (url) => {
    const id = +extractId(url);
    const user = db.find((user) => user.id === id);
    if (user) {
        return {
            status: true,
            hobbies: user.hobbies
        }
    }
    return {
        status: false,
        message: 'User not found'
    };
}

module.exports = {
    listHobbies,
    addHobby,
    deleteHobby
}