//let db = require('../aws/dynamo.dynasty.connector');
//let restaurants = db.table('Restaurants');
const MongoDB = require('../../integrations/mongodb/mongo.connector');
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const Promise = require('bluebird');


class restaurantModel {
    constructor() {
      this.db = MongoDB.getDB();
    }

    createRestaurants(restaurants) {
      let promises = restaurants.map(restaurant =>{
        return this.getRestaurantById(restaurant._id)
        .then(restaurantInDb =>{
          if(restaurantInDb === null){
            return MongoDB.getDB().collection("restaurants").insertOne(restaurant);
          }
        })
      })
      return Promise.all(promises).then(results => {
        logger.info(`Finished updating`, results.length, `restaurants into the DB`);
      });
    }

    updateRestaurantPhotos(id, photos){
      this.updatePartialRestaurant(id, "photos", photos)
    }

    updatePartialRestaurant(id, key, value) {
      let _oid = new ObjectID(id);
      let query = {
        "_id": _oid
      };
      let set = {$set: 
        {[key]: value}
      }
      return MongoDB.getDB().collection("restaurants").updateOne(query, set)
      .catch(err => {
        console.log('Error: ' + err);
      })
    }

    getRestaurantById(id){
      let _oid = new ObjectID(id);
      let query = {
        "_id": _oid
      };
      return MongoDB.getDB().collection('restaurants').findOne(query)
      .then(result => {
        return result;
      })
    }

    //search to avoid dubplicates from google call before inserting
    getRestaurantByPlaceId(placeId){
      let query = {
        "place_id": placeId
      };
      return MongoDB.getDB().collection('restaurants').findOne(query)
      .then(result => {
        return result;
      })
    }

}

module.exports = new restaurantModel();
