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
      var filter = {facebook_id: user.facebookId}
      var set = {
        $set: {
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          gender: user.gender,
          country: user.country,
          city: user.city,
          age: user.age,
          //ex mm/dd/yyyy or mm/dd
          birthday: user.birthday,

          //fb user_id
          facebook_id: user.facebookId,

          //access token
          facebook_token: user.facebookToken,

          //fb token expiry date
          facebook_token_expiry_date: user.facebookTokenExpiryDate,

          //array json web token
          foodme_tokens: user.foodmeTokens,

          //list of restaurant id's
          went_to_restaurant_list: user.wentToRestaurantList,
          liked_restaurant_list: user.likedRestaurantList,
          disliked_restaurant_list: user.dislikedRestaurantList,
        }
      }
      return MongoDB.getDB().collection('users').findOneAndUpdate(filter, set, {upsert:true, returnNewDocument : true })
      .then(result =>{
        //value == null means no record found, so inserted a new one instead of updating
        return user.facebookId;
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
