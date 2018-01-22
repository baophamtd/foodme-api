let db = require('../aws/dynamo.dynasty.connector');
let users = db.table('Users');

class userModel {

    /*
     * @params user:User object
     */
    createUser(user) {
      return users.insert(user)
    }

    getUser(facebookId) {
      return users.find(facebookId);
    }
}

module.exports = new userModel();
