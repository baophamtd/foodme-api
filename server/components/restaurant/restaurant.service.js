const crypto = require('crypto');
const Promise = require("bluebird");
const restaurantModel = require('./restaurant.model');
const googleService = require('../../integrations/google/google.service');
const yelpService = require('../../integrations/yelp/yelp.service');
const Restaurant = require('./restaurant.object');
const returnLimit = config.YELP.RETURN_LIMIT;

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

    loadNextPage({lat, lng, radius, minPrice, maxHeight, maxWidth, pagetoken, offset}){
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

  let restaurantsWithPlaceId = [];
  let restaurantsWithOutPlaceId = restaurants.filter(restaurant => {
    if(restaurant.place_id){
        restaurantsWithPlaceId.push(restaurant);
    }
    if(restaurant.place_id == null && !restaurant.in_db) {
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
            return {
                id: restaurant.id,
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
      .then(restaurants =>{
          return googleService.getBusyHours(restaurants);
      })
      .then(restaurants =>{
        return sortRestaurantsWithAIModel(restaurants);
      })
}

function sortRestaurantsWithAIModel(restaurants){
  let tempCategoryIdDict = {
    "american": 0,
    "spanish": 1,
    "thai": 2,
    "greek": 3,
    "french": 4,
    "vietnamese": 5,
    "mexican": 6,
    "indonesian": 7,
    "indian": 8,
    "chinese": 9,
    "german": 10,
    "filipino": 11,
    "turkish": 12,
    "hungarian": 13,
    "japanese": 14,
    "irish": 15,
    "korean": 16,
    "peruvian": 17,
    "moroccan": 18,
    "argentine": 19,
    "british": 20,
    "russian": 21,
    "swiss": 22,
    "australian": 23,
    "taiwanese": 24,
    "portuguese": 25,
    "iranian": 26,
    "brazilian": 27,
    "jamaican": 28,
    "polish": 29,
    "colombian": 30,
    "danish": 31,
    "ethiopian": 32,
    "belgian": 33,
    "czech": 34,
    "israeli": 35,
    "malaysian": 36,
    "swedish": 37,
    "egyptian": 38,
    "puerto": 39,
    "ukrainian": 40,
    "syrian": 41,
    "south": 42,
    "afghan": 43,
    "cambodian": 44,
    "chilean": 45,
    "pakistani": 46,
    "canadian": 47,
    "sri": 48,
    "lithuanian": 49,
    "bulgarian": 50,
    "norwegian": 51,
    "tunisian": 52,
    "austrian": 53,
    "nigerian": 54,
    "basque": 55,
    "maldivian": 56,
    "honduran": 57,
    "mongolian": 58,
    "serbian": 59,
    "algerian": 60,
    "ecuadorian": 61,
    "burmese": 62,
    "salvadoran": 63,
    "tibetan": 64,
    "icelandic": 65,
    "bangladeshi": 66,
    "singaporean": 67,
    "dutch": 68,
    "nepalese": 69
  }
  let restaurantsWithCategory = restaurants.filter(restaurant => {
    if(restaurant.types[0].alias){

        console.log(restaurant.types[0].alias);

        return true;
    }
    return false;
  });
  return restaurantsWithCategory;
/*
  let query = {
      user : 64,
      location : `${lat},${lng}`,
      radius,
      type,
      keyword : "",
      minPrice,
      maxPrice
  };

  let url = `http://localhost/predict?${querystring.stringify(query)}`;
  return fetch(url)
      .then(res => res.json())
      .catch(err => {
          console.log("Failed to retrieve data", err);
      })
*/
}

//helper method to merge results
function keyRestaurant(lat, lng) {
    return `${Number(lat).toFixed(3)}${Number(lng).toFixed(3)}`;
}


module.exports = new restaurantService();
