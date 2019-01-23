const MongoDB = require('../integrations/mongodb/mongo.connector');

const COLLECTION = "users";

class AuthModel {

    getSession(id) {
      const query = {
          facebookToken: id
        };
        return MongoDB.getDB().collection(COLLECTION).findOne(query)
          .then(result => {
          return result;
      })
    }
}

module.exports = new AuthModel();
