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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
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

          //fb token expiry date
          facebookTokenExpiryDate: user.facebookTokenExpiryDate,

          //array json web token
          foodmeTokens: user.foodmeTokens,

          //groupList
          groups: user.groups,

          //list of restaurant id's
          wentToRestaurants: user.wentToRestaurants,
          likedRestaurants: user.likedRestaurants,
          dislikedRestaurants: user.dislikedRestaurants,
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
          {facebookId: id}
        ]};
        return MongoDB.getDB().collection(COLLECTION).findOne(query)
          .then(result => {
          return result;
      })
    }
}

module.exports = new userModel();
