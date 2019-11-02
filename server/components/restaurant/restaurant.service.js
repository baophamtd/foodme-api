const crypto = require('crypto');
const Promise = require("bluebird");
const restaurantModel = require('./restaurant.model');
const googleService = require('../../integrations/google/google.service');
const yelpService = require('../../integrations/yelp/yelp.service');
const Restaurant = require('./restaurant.object');
const returnLimit = config.YELP.RETURN_LIMIT;

const querystring = require('querystring');
const fetch = require('node-fetch');
const WEATHER_API_KEY = 'a3a61defc8d1a149a9276e19249fd38d';



class restaurantService {

    constructor() {

    }

    createRestaurants(restaurants) {
        return restaurantModel.createRestaurants(restaurants);
    }

    getRestaurantById(place_id, id) {
        return restaurantModel.getRestaurantById(place_id, id)
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
      let googleRestaurants = googleService.getPlaces({lat, lng, radius, minPrice, maxPrice});
      let yelpRestaurants = yelpService.searchForRestaurants({lat, lng, radius, minPrice});

      return Promise.all([googleRestaurants, yelpRestaurants])
      .then(results =>{
        let nextPageToken = null;
        let offset = 0;
        if(results[0].next_page_token !== null){
          nextPageToken = results[0].next_page_token;
        }
        if(results[1].total > returnLimit){
          offset = returnLimit;
        }
        return processResultsFromRequests({googleResults:results[0].results, yelpResults:results[1].businesses, lat, lng, radius, maxHeight, maxWidth})
        .then(restaurants =>{
          return ({
            "restaurants": restaurants,
            "nextPageToken": nextPageToken,
            "offset": offset,
          })
        })
      })
    }

    loadNextPage({lat, lng, radius, minPrice, maxPrice, maxHeight, maxWidth, pagetoken, offset}){
      let googleRestaurants = googleService.getNextPage(pagetoken);
      let yelpRestaurants = yelpService.getNextRestaurants({lng, lat, radius, minPrice, offset});
      return Promise.all([googleRestaurants, yelpRestaurants])
      .then(results =>{
        let newNextPageToken = null;
        let newOffset = 0;
        if(results[0].next_page_token !== null){
          newNextPageToken = results[0].next_page_token;
        }
        if(results[1].total > offset){
          newOffset = parseInt(offset,10) + returnLimit;
        }
        return processResultsFromRequests({googleResults:results[0].results, yelpResults:results[1].businesses, lat, lng, radius, maxHeight, maxWidth})
        .then(restaurants =>{
          return ({
            "restaurants": restaurants,
            "nextPageToken": newNextPageToken,
            "offset": newOffset,
          })
        })
      })
    }
}

//insert the restaurants without place_id to avoid redundant requests
//these restaurants are pulled from Yelp
//not yet implemented inserting the redundant restaurants to DB
function insertAndRemoveRedundantRestaurants(restaurants){
  //console.log("list ", restaurants);
  let restaurantsWithPlaceId = [];
  let restaurantsWithOutPlaceId = restaurants.filter(restaurant => {
    if(restaurant.place_id){
        restaurantsWithPlaceId.push(restaurant);
    }
    if(restaurant.place_id === null && !restaurant.in_db) {
      //console.log(restaurant);
      return true;
    }

    return false;
  });
  restaurantModel.createRestaurants(restaurantsWithOutPlaceId)
  .then(results => {
    console.log("Successfully serialized restaurants", results);
  })
  .catch(err => {
    console.log("Failed to serialize restaurants", err);
  });
  return restaurantsWithPlaceId;
}

//filter restaurants result with DB to avoid redundant requests
function filterRestaurantsWithDB(restaurants){
  let restaurantsAfterFiltering = [];
  var promises = restaurants.map((restaurant) => {
      if(restaurant.place_id){
        return restaurantModel.getRestaurantByPlaceId(restaurant.place_id)
        .then(restaurantFromDB =>{
          if(restaurantFromDB){
            restaurantFromDB.in_db = true;
            restaurantFromDB.open_now = restaurant.open_now;
            return restaurantFromDB;
          }else {
            restaurant.in_db = false;
            return restaurant;
          }
        })
      }else{
        return restaurantModel.getRestaurantById(restaurant.id)
        .then(restaurantFromDB =>{
          if(restaurantFromDB){
            restaurantFromDB.in_db = true;
            restaurantFromDB.open_now = restaurant.open_now;
            return restaurantFromDB;
          }else {
            restaurant.in_db = false;
            return restaurant;
          }
        })
      }
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
            if(restaurant.in_db){
              restaurant.place_id = restaurant.place_id;
              restaurant.busy_hours = restaurant.busy_hours;
              restaurant.in_db = restaurant.in_db;
            }
            if(redundantRestaurant.in_db){
              restaurant.place_id = redundantRestaurant.place_id;
              restaurant.busy_hours = redundantRestaurant.busy_hours;
              restaurant.in_db = redundantRestaurant.in_db;
            }
            return {
                id: restaurant.id,
                place_id: restaurant.place_id,
                place_id: restaurant.place_id,
                name: restaurant.name,
                open_now: restaurant.open_now,
                photos: restaurant.photos.concat(redundantRestaurant.photos),
                location: restaurant.location,
                address: restaurant.address,
                busy_hours: restaurant.busy_hours,
                /*
                city: restaurant.city,
                country: restaurant.country,
                state: restaurant.state,
                zip: restaurant.zip_code,
                */
                favorited: restaurant.favorited,
                likes: restaurant.likes,
                dislikes: restaurant.dislikes,
                views: restaurant.views,
                visits: restaurant.visits,
                price: restaurant.price || redundantRestaurant.price,
                rating: (restaurant.rating + redundantRestaurant.rating) / 2,
                types: redundantRestaurant.types,
                distance: restaurant.distance,
                in_db: restaurant.in_db,
            }

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
  //console.log(restaurants);
    return restaurants.map(restaurant => {
        return {
            //Old code Shinjo added random 40 bytes id
            //id: crypto.randomBytes(40).toString('hex'),
            id: restaurant.id,
            place_id: null,
            name: restaurant.name,
            open_now: !restaurant.is_closed || false,
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
      let open_now = true;
      if(restaurant.opening_hours != null){
        open_now = restaurant.opening_hours.open_now;
      }
      return {
          id: restaurant.id,
          place_id: restaurant.place_id,
          name: restaurant.name,
          open_now: open_now,
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

function getTemperature({lat, lng, restaurants}){
  let end_point = "https://api.openweathermap.org/data/2.5/weather?";
  let query = {
    lat: lat,
    lon: lng,
    appid: WEATHER_API_KEY,
  }

  let url = `${end_point}${querystring.stringify(query)}`;
  return fetch(url)
  .then(result => result.json())
  .then(responseJSON =>{
    return restaurants.map(restaurant => {
      restaurant.temperature = responseJSON.main;
      return restaurant;
    })
  })
}

//process results from Google and Yelp returns
function processResultsFromRequests({googleResults, yelpResults, lat, lng, radius, maxHeight, maxWidth}){
  let googleRestaurants = filterRestaurantsWithDB(googleReduceRestaurants(googleResults));
  let yelpRestaurants = filterRestaurantsWithDB(yelpReduceRestaurants(yelpResults))
  .then(restaurants => {
    return googleService.getAvailablePlaceId({restaurants, lat, lng, radius});
  })
  .then(restaurants =>{
    return insertAndRemoveRedundantRestaurants(restaurants);
  })

  return Promise.all([googleRestaurants, yelpRestaurants])
      .then(results =>{
          return mergeSearchResults(results);
      })
      .then(restaurants =>{
          return googleService.getPhotoUrls({restaurants, maxHeight, maxWidth});
      })
      .then(restaurants =>{
          return googleService.getDistances({lat, lng, restaurants});
      })
      /*
      .then(restaurants =>{
          return googleService.getBusyHours(restaurants);
      })
      */
      .then(restaurants =>{
          return getTemperature({lat, lng, restaurants});
      })
}

//helper method to merge results
function keyRestaurant(lat, lng) {
    return `${Number(lat).toFixed(3)}${Number(lng).toFixed(3)}`;
}


module.exports = new restaurantService();
