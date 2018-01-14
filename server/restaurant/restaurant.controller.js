const googleService = require('../google/google.service');
const restaurantService = require('./restaurant.service');
const restHelper = require('../rest/rest.helper');
class restaurantController {
    constructor() {
        this.getRestaurants = this.getRestaurants.bind(this);
    }

    getRestaurants(req, res) {
        let {lat, lng, minPrice, maxPrice, radiusMiles, radiusKilometers, maxHeight, maxWidth, minRating} = req.query;
        let radius = calculateRadius(radiusMiles, radiusKilometers);

        googleService.getPlaces({lat, lng, radius, minPrice, maxPrice})
            .then(json => json.results)
            .then(restaurants => filterRestaurants(restaurants, minPrice, maxPrice, minRating))
            .then(restaurants => reduceRestaurants(restaurants, maxHeight, maxWidth))
            .then(restaurants => res.send(restaurants))
            .then(restaurants => batchCreateRestaurants)
            .catch(err => {
                logger.error("Failed to retrieve restaurants", err);
                res.send("Failed to retrieve restaurants").status(400);
            });
    }

    getRestaurant(req, res) {
        let {id} = req.params;
        restaurantService.getRestaurant(id)
            .then(restaurant => {
                if(restaurant)
                    res.send(restHelper.buildResponse(null, restaurant));
                else                    
                    res.send(restHelper.buildResponse(null, [])).status(404);    
            })
            .catch(err => {                
                res.send(restHelper.buildResponse(err, [])).status(500);
            });
    }

    createRestaurant(req, res) {

    }
}

function calculateRadius(radiusMiles, radiusKilometers)  {
    if(radiusMiles) return radiusMiles * 1609.34;
    if(radiusKilometers) return radiusKilometers * 1000;
    return 1500.0;
}

function batchCreateRestaurants(restaurants) {
    return Promise.map(restaurant => {
        restaurantService.createRestaurant(rest)
    })
}

function filterRestaurants(restaurants, minPrice, maxPrice, minRating) {
    return restaurants.filter(restaurant => {
        let price = restaurant.price_level;
        if(price >= minPrice && price <= maxPrice && restaurant.rating >= minRating) {
            return true;
        }
        return false;
    });
}

function reduceRestaurants(restaurants, maxHeight, maxWidth) {
    return restaurants.map(restaurant => {
        let photos = googleService.generatePhotoUrls({photos: restaurant.photos, maxHeight, maxWidth});
        return {
            id: restaurant.id,
            location: restaurant.geometry.location,
            icon: restaurant.icon,
            photos: photos,
            name: restaurant.name,
            rating: restaurant.rating
        }
    });
}

module.exports = restaurantController;
