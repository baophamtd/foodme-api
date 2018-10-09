//let db = require('../aws/dynamo.dynasty.connector');
//let restaurants = db.table('Restaurants');
const MongoDB = require('../mongodb/mongo.connector');
const assert = require('assert');
//const Promise = require('bluebird');


class restaurantModel {
    constructor() {
      //const db = MongoDB.getDB();
    }

    updateRestaurant(id, update) {
        //return restaurants.update(id, update);
    }

    createRestaurants(restaurants) {
      var promises = restaurants.map(restaurant =>{
        var filter = {
          $or: [
            {place_id: restaurant.place_id},
            {id: restaurant.id}
          ]
        }
        var set = {
          $set: {
            place_id: restaurant.place_id,
            id: restaurant.id,
            name: restaurant.name,
            location: restaurant.location,
            country: restaurant.country,
            state: restaurant.state,
            city: restaurant.city,
            zip: restaurant.zip,
            address: restaurant.address,
            price: restaurant.price,
            rating: restaurant.rating,
            photos: restaurant.photos,
            types: restaurant.types,
            categories: restaurant.categories,
            favorited: restaurant.favorited,
            likes: restaurant.likes,
            dislikes: restaurant.dislikes,
            views: restaurant.views,
            visits: restaurant.visits,
          }
        }
        return MongoDB.getDB().collection('restaurants').findOneAndUpdate(filter, set, {upsert:true, returnNewDocument : true })
      })

      return Promise.all(promises).then(results => {
        console.log(results.length);
        return results.length;
      });
    }

    //place_id from google and id from yelp
    getRestaurantByID(place_id, id) {
      var query = {
          $or: [
            {place_id: place_id},
            {id: id}
          ]}
      return MongoDB.getDB().collection('restaurants').findOne(query)
      .then(result => {
        return result;
      })
    }
}

module.exports = new restaurantModel();
