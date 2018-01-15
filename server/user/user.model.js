let db = require('../aws/dynamo.dynasty.connector');
let users = db.table('Users');
let User = require('./user.object')

class userModel {

    /*
     * @params user:User object
     */
    createUser(user) {
      user = new User();
      console.log("USER:"+ user);
      users.insert(user)
      .catch(function (error){
        console.log(error);
      });
    }
/*
    //user's info
    id,
    firstName,
    lastName,
    gender,
    hometown,
    age,
    //ex mm/dd/yyyy or mm/dd
    birthday,

    //access token
    facebookToken,

    //json web token
    foodmeToken,

    //list of restaurant id's
    restaurantList*/

    getUser(query) {
        return new Promise((resolve, reject) => {
            dynamoConnector.get(query, function(err, data) {
                if(err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}

module.exports = new userModel();
