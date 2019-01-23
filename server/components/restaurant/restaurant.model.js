//let db = require('../aws/dynamo.dynasty.connector');
//let restaurants = db.table('Restaurants');
const MongoDB = require('../../integrations/mongodb/mongo.connector');
const assert = require('assert');
//const Promise = require('bluebird');


class restaurantModel {
    constructor() {
      this.db = MongoDB.getDB();
      this.createRestaurants = this.createRestaurants.bind(this);
      this.getRestaurantById = this.getRestaurantById.bind(this);
    }

    updateRestaurant(id, update) {
        //return restaurants.update(id, update);
    }

    createRestaurants(restaurants) {
      var promises = restaurants.map(restaurant =>{
        let filter;
        if(restaurant.place_id){
          filter = {placeId: restaurant.place_id}
        }else{
          filter = {id: restaurant.id}
        }
        
        var set = {
          $set: {
            placeId: restaurant.place_id,  //if place has place_id, the id field is from Google
            id: restaurant.id,              //if place_id above is NOT null, this field is from Yelp
            name: restaurant.name,
            photos: restaurant.photos,
            location: restaurant.location,
            /*
            country: restaurant.country,
            state: restaurant.state,
            city: restaurant.city,
            zip: restaurant.zip,
            */
            address: restaurant.address,
            price: restaurant.price,
            rating: restaurant.rating,
            busyHours: restaurant.busy_hours || null,
            types: restaurant.types,
            favorited: restaurant.favorited || null,
            likes: restaurant.likes || null,
            dislikes: restaurant.dislikes || null,
            views: restaurant.views || null,
            visits: restaurant.visits || null,
          }
        }
        return MongoDB.getDB().collection('restaurants').findOneAndUpdate(filter, set, {upsert:true, returnNewDocument : true })
      })

      return Promise.all(promises).then(results => {
        return results.length;
      });
    }

    //place_id from google
    getRestaurantByPlaceId(place_id) {
      var query = {
          placeId: place_id
        };
      return MongoDB.getDB().collection('restaurants').findOne(query)
      .then(result => {
        return result;
      })
    }

    //and id from yelp
    getRestaurantById(id){
      var query = {
          id: id
        };
      return MongoDB.getDB().collection('restaurants').findOne(query)
      .then(result => {
        return result;
      })
    }
}

module.exports = new restaurantModel();
