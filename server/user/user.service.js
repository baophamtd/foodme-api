const userModel = require('./user.model');
const Promise = require('bluebird');
const User = require('./user.object');

class userService {

    constructor() {

    }

    createUser(user) {
      user = new User();
      console.log("GET CALLED:"+ typeof(user));
        userModel.createUser(user);
    }

    getUser(restaurant) {
        return userModel.getUser(user);
    }

    deleteUser(restaurant) {

    }


}

module.exports = new userService();
