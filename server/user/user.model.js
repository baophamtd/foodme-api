//let db = require('../aws/dynamo.dynasty.connector');
//let users = db.table('Users');
const MongoDB = require('../mongodb/mongo.connector');
const assert = require('assert');

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
      var filter = {id: user.id}
      var set = {
        $set: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          country: user.country,
          city: user.city,
          age: user.age,
          //ex mm/dd/yyyy or mm/dd
          birthday: user.birthday,

          //fb user_id
          facebookId: user.facebookId,

          //access token
          facebookToken: user.facebookToken,

          //array json web token
          foodmeTokens: user.foodmeTokens,

          //list of restaurant id's
          wentToRestaurantList: user.wentToRestaurantList,
          likedRestaurantList: user.likedRestaurantList,
          dislikedRestaurantList: user.dislikedRestaurantList,
        }
      }
      return MongoDB.getDB().collection('users').findOneAndUpdate(filter, set, {upsert:true, returnNewDocument : true })
      .then(result =>{
        return (result.value == null) ? user.id:0;
      })

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
