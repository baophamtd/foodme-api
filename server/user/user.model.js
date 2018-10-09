//let db = require('../aws/dynamo.dynasty.connector');
//let users = db.table('Users');

class userModel {

    /*
     * @params user:User object
     */
    createUser(user) {
      /*
      users.insert(user)
      .catch(function (error){
        logger.error("Failed to create user", error);
      });
      */
    }

    getUser(query) {
      /*
        return dynamoConnector.get(query, function(err, data) {
            if(err) {
                reject(err);
            }
            resolve(data);
        });
        */
    }
}

module.exports = new userModel();
