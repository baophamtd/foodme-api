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
      var filter = {facebookId: user.facebookId}
      var set = {
        $set: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          gender: user.gender,
          country: user.country,
          city: user.city,
          age: user.age,
          //ex mm/dd/yyyy or mm/dd
          birthday: user.birthday,

          //fb user_id
          facebook_id: user.facebook_id,

          //access token
          facebook_token: user.facebook_token,

          //fb token expiry date
          facebook_token_expiry_date: user.facebook_token_expiry_date,

          //array json web token
          foodme_tokens: user.foodme_tokens,

          //groupList
          groups: user.groups,

          //list of restaurant id's
          went_to_restaurants: user.went_to_restaurants,
          liked_restaurants: user.liked_restaurants,
          disliked_restaurants: user.disliked_restaurants,
        }
      }

      return MongoDB.getDB().collection(COLLECTION).findOneAndUpdate(filter, set, {upsert:true, returnNewDocument : true })
      .then(result =>{
        //value == null means no record found, so inserted a new one instead of updating
        return user.facebook_id;
      })

    }

    getUser(id) {
      const query = {
        $or: [
          {facebookId: id}
        ]};
        return MongoDB.getDB().collection(COLLECTION).findOne(query)
          .then(result => {
          return result;
      })
    }
}

module.exports = new userModel();
