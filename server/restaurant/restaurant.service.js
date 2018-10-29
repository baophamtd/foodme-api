const crypto = require('crypto');
const Promise = require("bluebird");
const restaurantModel = require('./restaurant.model');
const googleService = require('../google/google.service');
const yelpService = require('../yelp/yelp.service');
const Restaurant = require('./restaurant.object');

class restaurantService {

    constructor() {

    }

    createRestaurants(restaurants) {
        return restaurantModel.createRestaurants(restaurants);
    }

    getRestaurantByID(place_id, id) {
        return restaurantModel.getRestaurantByID(place_id, id)
          .then(result => {
            return result;
          })
    }

    deleteRestaurant(restaurant) {

    }

    favoritedRestaurant(id) {
        return restaurantModel.getRestaurant(id)
            .then(restaurant => {
                return restaurantModel.updateRestaurant(id, {favorited: restaurant.favorited + 1});
            });
    }

    likeRestaurant(id) {
        return restaurantModel.getRestaurant(id)
            .then(restaurant => {
                return restaurantModel.updateRestaurant(id, {likes: restaurant.likes + 1});
            });
    }

    dislikeRestaurant(id) {
        return restaurantModel.getRestaurant(id)
        .then(restaurant => {
            return restaurantModel.updateRestaurant(id, {dislikes: restaurant.dislikes + 1});
        });
    }

    searchForRestaurants({lat, lng, radius, minPrice, maxPrice, maxHeight, maxWidth}) {
        let googleRestaurants = googleService.getPlaces({lat, lng, radius, minPrice, maxPrice})
            .then(json => json.results)
            .then(restaurants => googleReduceRestaurants(restaurants))
            .then(restaurants => {
              return filterRestaurantsWithDB(restaurants);
            })
            .then(restaurants => {
              return googleService.getPhotoUrls({restaurants, maxHeight, maxWidth});
            })
            .then(restaurants =>{
              return googleService.getBusyHours(restaurants);
            })

        let yelpRestaurants = yelpService.searchForRestaurants({lat, lng, radius, minPrice})
            .then(results => results.businesses)
            .then(restaurants => {
              //console.log(restaurants);
              return yelpReduceRestaurants(restaurants)})
            .then(restaurants => {
              return filterRestaurantsWithDB(restaurants);
            })
            .then(restaurants => {
              return googleService.getAvailablePlaceID({restaurants, lat, lng, radius});
            })
            .then(restaurants =>{
              return insertAndRemoveRedundantRestaurants(restaurants);
            })
            .then(restaurants => {
              return googleService.getPhotoUrls({restaurants, maxHeight, maxWidth});
            })
            .then(restaurants =>{
              return googleService.getBusyHours(restaurants);
            })

        return Promise.all([googleRestaurants, yelpRestaurants])
            .then(results =>{
              return mergeSearchResults(results)
            })
    }
}

//insert the restaurants without place_id to avoid redundant requests
//these restaurants are pulled from Yelp
function insertAndRemoveRedundantRestaurants(restaurants){
  //console.log(restaurants);
  var promises = restaurants
    .filter(function(restaurant) {
        if (restaurant.place_id == null) {
          return false; // skip
        }
        return true;
    })
    .map((restaurant) => {
        return restaurant;
      })

  return Promise.all(promises).then(results => {
    return results;
  });
}

//filter restaurants result with DB to avoid redundant requests
function filterRestaurantsWithDB(restaurants){
  var promises = restaurants.map((restaurant) => {
      return restaurantModel.getRestaurantByID(restaurant.place_id, restaurant.id)
      .then(_restaurant =>{
        if(_restaurant){
          _restaurant.in_db = true;
          return _restaurant;
        }else{
          restaurant.in_db = false;
          return restaurant;
        }
      })

  });

  return Promise.all(promises).then(results => {
    return results;
  });
}

//merge results from both APIs
function mergeSearchResults(results) {
    let dictYelp = [];

    let googleResults = results[0];
    let yelpResults = results[1];
    yelpResults.forEach(result => {
        //Load the items into a dictionary for fast lookup keyed by the lat+lng
        dictYelp[keyRestaurant(result.location.lat, result.location.lng)] = result;
    });

    let mergedResults = googleResults.map(restaurant => {
        let key = keyRestaurant(restaurant.location.lat, restaurant.location.lng);
        let redundantRestaurant = dictYelp[key];
        if(redundantRestaurant) {
            return new Restaurant({
                id: restaurant.id,
                place_id: restaurant.place_id,
                name: restaurant.name,
                photos: restaurant.photos.concat(redundantRestaurant.photos),
                location: restaurant.location,
                /*
                city: restaurant.city,
                country: restaurant.country,
                state: restaurant.state,
                zip: restaurant.zip_code,
                */
                price: restaurant.price || redundantRestaurant.price,
                rating: (restaurant.rating + redundantRestaurant.rating) / 2,
                types: restaurant.types,
            })

            delete dictYelp[key]
        } else {
            return restaurant;
        }
    });

    for (var key in dictYelp) {
        if (dictYelp.hasOwnProperty(key)) {
            mergedResults.push(dictYelp[key]);
        }
    }

    return mergedResults;
}

//remove unneccessary fields
function yelpReduceRestaurants(restaurants) {
    return restaurants.map(restaurant => {
        return {
            //Old code Shinjo added random 40 bytes id
            //id: crypto.randomBytes(40).toString('hex'),
            id: restaurant.id,
            place_id: null,
            name: restaurant.name,
            //open_now: !restaurant.is_closed || false,
            photos: [restaurant.image_url || "No Photo"],
            location: {
                lat: restaurant.coordinates.latitude,
                lng: restaurant.coordinates.longitude
            },
            address: restaurant.location.address1 + ", "+ restaurant.location.city,
            /*
            city: restaurant.location.city,
            state: restaurant.location.state,
            country: restaurant.location.country,
            zip: restaurant.location.zip_code,
            */
            price: restaurant.price ? restaurant.price.length : 0,
            rating: restaurant.rating,
            types: restaurant.categories
        };
    });
}

//remove unneccessary fields
function googleReduceRestaurants(restaurants) {
    return restaurants.map(restaurant => {
        return {
            id: restaurant.id,
            place_id: restaurant.place_id,
            name: restaurant.name,
            //open_now: restaurant.opening_hours.open_now || false,
            photos: restaurant.photos,
            location: {
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng,
            },
            address: restaurant.vicinity,
            price: restaurant.price_level || 0,
            rating: restaurant.rating,
            types: restaurant.types,
            //icon: restaurant.icon,
        };
    });
}

//helper method to merge results
function keyRestaurant(lat, lng) {
    return `${Number(lat).toFixed(3)}${Number(lng).toFixed(3)}`;
}


module.exports = new restaurantService();
