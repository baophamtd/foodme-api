const restaurantService = require('./restaurant.service');
const restHelper = require('../rest/rest.helper');
const Promise = require('bluebird');

class restaurantController {
    constructor() {
        this.getRestaurants = this.getRestaurants.bind(this);
    }

    likeRestaurant(req, res) {
        let {id} = req.params;
        restaurantService.likeRestaurant(id)
            .then(result => {
                res.send("Succes");
            })
            .catch(err => {
                res.send("Failed " + err).status(400);
            })
    }
    
    dislikeRestaurant(req, res) {
        let {id} = req.params;
        restaurantService.dislikeRestaurant(id)
            .then(result => {
                res.send("Succes");
            })
            .catch(err => {
                res.send("Failed " + err).status(400);
            })
    }
    
    favoriteRestaurant(req, res) {
        let {id} = req.params;
        restaurantService.favoriteRestaurant(id)
            .then(result => {
                res.send("Succes");
            })
            .catch(err => {
                res.send("Failed").status(400);
            })
    }

    getRestaurants(req, res) {
        let {lat, lng, minPrice, maxPrice, radiusMiles, radiusKilometers, maxHeight, maxWidth, minRating} = req.query;
        let radius = calculateRadius(radiusMiles, radiusKilometers);       

        restaurantService.searchForRestaurants({lat, lng, radius, minPrice, maxPrice})
           // .then(restaurants => filterRestaurants(restaurants, minPrice, maxPrice, minRating))
            .then(restaurants => {
                res.send(restaurants);
                
                batchCreateRestaurants(restaurants)
                    .catch(err => {
                        logger.error("Failed to insert restaurants database", err);
                    })
            })
            .then(done => logger.info("Finished inserting restaurants into the DB"))
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
    return Promise.map(restaurants, restaurant => {
        restaurantService.createRestaurant(restaurant)
            .catch(err => { logger.error("Failed to write restaurant to database.", restaurant)})
    })
}

function filterRestaurants(restaurants, minPrice, maxPrice, minRating) {
    return restaurants.filter(restaurant => {
        let price = restaurant.price;
        if((price >= minPrice || price == 0) && price <= maxPrice && restaurant.rating >= minRating) {
            return true;
        }
        return false;
    });
}

module.exports = restaurantController;
