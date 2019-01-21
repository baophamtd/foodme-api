//let db = require('../aws/dynamo.dynasty.connector');
//let users = db.table('Users');
const MongoDB = require('../../integrations/mongodb/mongo.connector');
const assert = require('assert');

const COLLECTION = "users";

class userModel {

    /*
     * @params user:User object
     */
    authenticate() {

    }

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
      return MongoDB.getDB().collection(COLLECTION).findOneAndUpdate(filter, set, {upsert:true, returnNewDocument : true })
      .then(result =>{
        //value == null means no record found, so inserted a new one instead of updating
        return user.facebookId;
      })

    }

    getUser(id) {
      const query = {
        $or: [
          {facebook_id: id}
        ]};
        return MongoDB.getDB().collection(COLLECTION).findOne(query)
          .then(result => {
          return result;
      })
    }
}

module.exports = new userModel();
