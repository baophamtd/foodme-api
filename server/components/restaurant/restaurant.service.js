const crypto = require('crypto');
const Promise = require("bluebird");
const restaurantModel = require('./restaurant.model');
const googleService = require('../../integrations/google/google.service');
const yelpService = require('../../integrations/yelp/yelp.service');
const Restaurant = require('./restaurant.object');
const returnLimit = config.YELP.RETURN_LIMIT;
const ObjectID = require('mongodb').ObjectID;


const querystring = require('querystring');
const fetch = require('node-fetch');
const WEATHER_API_KEY = 'a3a61defc8d1a149a9276e19249fd38d';

class restaurantService {
  constructor() {

  }

  createRestaurants(restaurants) {
      return restaurantModel.createRestaurants(restaurants);
  }

  getRestaurantById(id) {
      return restaurantModel.getRestaurantById(place_id, id)
        .then(result => {
          return result;
        })
  }

  deleteRestaurant(restaurant) {

  }

  searchRestaurants(lat, lng, radius){
    return googleService.getPlaces(lat, lng, radius)
      .then(result => {
        //this map is used to filter restaurants from google which are already in the db
        let promises = result.restaurants.map(restaurant =>{
          let openNow = restaurant.open_now;
          return restaurantModel.getRestaurantByPlaceId(restaurant.place_id)
          .then(restaurantInDb =>{
            if(restaurantInDb !== null) {
              restaurantInDb.open_now = openNow;
              return restaurantInDb;
            }
            else{
              restaurant._id = new ObjectID();
              restaurant.open_now = openNow;
              return restaurant;
            }
          })
        })

        return Promise.all(promises)
        .then(restaurants =>{
          restaurantModel.createRestaurants(restaurants);
          let openRestaurants = restaurants.filter(restaurant => {
            if(restaurant.open_now){
                return true;
            }    
            return false;
          });
          return openRestaurants;
        })
      })
  }

  getRestaurantPhotos(id, limit) {
    return restaurantModel.getRestaurantById(id)
          .then(restaurant =>{
            if(restaurant.photos !== null && restaurant.photos.length > 1){
              return restaurant.photos.slice(0, limit);
            }
            return googleService.getRestaurantPhotos(restaurant.place_id);
          })
          .then(photos =>{
            restaurantModel.updateRestaurantPhotos(id, photos);
            if(photos.length > limit) photos = photos.slice(0, limit);
            return photos;
          })
  }

}

module.exports = new restaurantService();
