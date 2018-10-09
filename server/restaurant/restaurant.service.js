const crypto = require('crypto');

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
            .then(restaurants => {
              //console.log(restaurants);
              return filterRestaurantsWithDB(restaurants);
            })
            .then(restaurants => googleService.getPhotoUrls({restaurants, maxHeight, maxWidth}))
            //.then(restaurants => googleReduceRestaurants(restaurants, maxHeight, maxWidth))

        let yelpRestaurants = yelpService.searchForRestaurants({lat, lng, radius, minPrice})
            .then(results => results.businesses)
            .then(restaurants => {
              //console.log(restaurants);
              return filterRestaurantsWithDB(restaurants);
            })
            .then(restaurants => googleService.getAvailablePlaceID({restaurants, lat, lng, radius}))
            .then(restaurants => googleService.getPhotoUrls({restaurants, maxHeight, maxWidth}))
            //.then(restaurants => yelpReduceRestaurants(restaurants))

        return Promise.all([googleRestaurants, yelpRestaurants])
            .then(mergeSearchResults)
    }
}

//filter restaurants result with DB to avoid redundant requests
function filterRestaurantsWithDB(restaurants){
  var promises = restaurants.map((restaurant) => {
      return restaurantModel.getRestaurantByID(restaurant.place_id, restaurant.id)
      .then(_restaurant =>{
        if(_restaurant){
          _restaurant.in_db = true;
          return _restaurant
        }else{
          restaurant.in_db = false;
          return restaurant
        }
      })

  });

  return Promise.all(promises).then(results => {
    return results;
  });
}

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
                place_id: restaurant.place_id,
                id: restaurant.id,
                in_db: restaurant.in_db,
                name: restaurant.name,
                photos: restaurant.photos.concat(redundantRestaurant.photos),
                icon: restaurant.icon,
                city: restaurant.city,
                country: restaurant.country,
                state: restaurant.state,
                zip: restaurant.zip_code,
                location: restaurant.location,
                rating: (restaurant.rating + redundantRestaurant.rating) / 2,
                types: restaurant.types,
                price: restaurant.price || redundantRestaurant.price,
                categories: redundantRestaurant.categories
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

function yelpReduceRestaurants(restaurants) {
    return restaurants.map(restaurant => {
        return new Restaurant({
            place_id: restaurant.place_id,
            //Old code Shinjo added random 40 bytes id
            //id: crypto.randomBytes(40).toString('hex'),
            id: restaurant.id,
            name: restaurant.name,
            photos: [restaurant.image_url || "No Photo"],
            city: restaurant.location.city,
            country: restaurant.location.country,
            state: restaurant.location.state,
            address: restaurant.location.address1,
            zip: restaurant.location.zip_code,
            location: {
                lat: restaurant.coordinates.latitude,
                lng: restaurant.coordinates.longitude
            },
            price: restaurant.price ? restaurant.price.length : 0,
            rating: restaurant.rating,
            categories: restaurant.categories
        })
    });
}

function googleReduceRestaurants(restaurants, maxHeight, maxWidth) {
    return restaurants.map(restaurant => {
        return new Restaurant({
            place_id: restaurant.place_id,
            id: restaurant.id,
            location: {
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng,
            },
            price: restaurant.price_level || 0,
            icon: restaurant.icon,
            address: restaurant.vicinity,
            photos: restaurant.photos,
            name: restaurant.name,
            rating: restaurant.rating,
            types: restaurant.types
        });
    });
}

function keyRestaurant(lat, lng) {
    return `${Number(lat).toFixed(3)}${Number(lng).toFixed(3)}`;
}


module.exports = new restaurantService();
