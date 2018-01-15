const crypto = require('crypto');

const restaurantModel = require('./restaurant.model');
const googleService = require('../google/google.service');
const yelpService = require('../yelp/yelp.service');

class restaurantService {

    constructor() {

    }    

    createRestaurant(restaurant) {
        return restaurantModel.createRestaurant(restaurant);
    }

    getRestaurant(id) {
        return restaurantModel.getRestaurant(id);
    }

    deleteRestaurant(restaurant) {

    }

    searchForRestaurants({lat, lng, radius, minPrice, maxPrice, maxHeight, maxWidth}) {
        let googleRestaurants = googleService.getPlaces({lat, lng, radius, minPrice, maxPrice})
            .then(json => json.results)
            .then(restaurants => googleReduceRestaurants(restaurants, maxHeight, maxWidth))

        let yelpRestaurants = yelpService.searchForRestaurants({lat, lng, radius, minPrice})
            .then(results => results.jsonBody.businesses)
            .then(yelpReduceRestaurants)

        return Promise.all([googleRestaurants, yelpRestaurants])
            .then(mergeSearchResults)
    }
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
            return {
                id: restaurant.id,
                name: restaurant.name,
                photos: restaurant.photos.concat(redundantRestaurant.photos),
                icon: restaurant.icon,
                location: restaurant.location,
                rating: (restaurant.rating + redundantRestaurant.rating) / 2,
                types: restaurant.types,
                price: restaurant.price || redundantRestaurant.price,
                categories: redundantRestaurant.categories
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

function yelpReduceRestaurants(restaurants) {
    return restaurants.map(restaurant => {
        return {
            id: crypto.randomBytes(40).toString('hex'),
            name: restaurant.name,
            photos: [restaurant.image_url || "No Photo"],
            location: {
                lat: restaurant.coordinates.latitude,
                lng: restaurant.coordinates.longitude
            },
            price: restaurant.price.length || 0,
            rating: restaurant.rating, 
            categories: restaurant.categories
        }
    });
}

function googleReduceRestaurants(restaurants, maxHeight, maxWidth) {
    return restaurants.map(restaurant => {
        let photos = googleService.generatePhotoUrls({photos: restaurant.photos, maxHeight, maxWidth});
        return {
            id: restaurant.id,
            location: {                
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng,
            },
            price: restaurant.price_level || 0,
            icon: restaurant.icon,
            photos: photos,
            name: restaurant.name,
            rating: restaurant.rating,
            types: restaurant.types
        }
    });
}

function keyRestaurant(lat, lng) {
    return `${Number(lat).toFixed(3))}${Number((lng).toFixed(3))}`; 
}


module.exports = new restaurantService();
