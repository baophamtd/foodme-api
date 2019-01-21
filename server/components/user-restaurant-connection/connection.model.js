//let db = require('../aws/dynamo.dynasty.connector');
//let users = db.table('Users');
const MongoDB = require('../../integrations/mongodb/mongo.connector');
const assert = require('assert');

class connectionModel {

    insertConnection(connection) {

      return MongoDB.getDB().collection('connections').insertOne(connection)
      .then(result =>{
        return (result.result.ok == 1)? 1:0;
      })

    }
}

module.exports = new connectionModel();
