let dynamoConnector = require('../aws/dynamo.document.connector');
let User = require('./user.object')

class userModel {

    /*
     * @params user:User object
     */
    createUser(user) {

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

module.exports = restaurantModel;
