const userModel = require('./user.model');
const Promise = require('bluebird');
const User = require('./user.object');

class userService {

    constructor() {

    }

    createUser(user) {
        return userModel.createUser(user);
    }

    getUser(facebookId) {
        return userModel.getUser(facebookId);
    }

    deleteUser(restaurant) {

    }


}

module.exports = new userService();
