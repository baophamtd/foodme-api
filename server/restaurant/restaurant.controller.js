const googleServiceClass = require('../google/google.service');
const googleService = new googleServiceClass();

class restaurantController {
    constructor() {
        this.calculateRadius = this.calculateRadius.bind(this);
        this.getRestaurants = this.getRestaurants.bind(this);
    }

    getRestaurants(req, res) {
        let {lat, lng, minPrice, maxPrice, radiusMiles, radiusKilometers, maxHeight, maxWidth, minRating} = req.query;
        let radius = this.calculateRadius({radiusMiles, radiusKilometers});
        googleService.getPlaces({lat, lng, radius, minPrice, maxPrice})
            .then(json => json.results)
            .then(restaurants => filterRestaurants(restaurants, minPrice, maxPrice, minRating))
            .then(restaurants => reduceRestaurants(restaurants, maxHeight, maxWidth))
            .then(restaurants => res.send(restaurants))
            .catch(err => {
                console.error("Failed to retrieve restaurants", err);
                res.send("Failed to retrieve restaurants").status(400);
            })       
    }
    
	calculateRadius({radiusMiles, radiusKilometers})  {
		if(radiusMiles) return radiusMiles * 1609.34; 
		if(radiusKilometers) return radiusKilometers * 1000;
		return 1500.0;
	}
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
            location : restaurant.geometry.location,
            icon : restaurant.icon,
            photos : photos,
            name: restaurant.name            
        }
    });
}

module.exports = restaurantController;