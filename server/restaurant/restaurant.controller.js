const googleServiceClass = require('../google/google.service');
const googleService = new googleServiceClass();

class restaurantController {
    constructor() {
        this.calculateRadius = this.calculateRadius.bind(this);
        this.getRestaurants = this.getRestaurants.bind(this);
    }

    getRestaurants(req, res) {
        let {lat, lng, minPrice, maxPrice, radiusMiles, radiusKilometers} = req.query;
        let radius = this.calculateRadius({radiusMiles, radiusKilometers});
        googleService.getPlaces({lat, lng, radius, minPrice, maxPrice})
            .then(json => {
                let restaurants = json.results.map(restaurant => {
                    return restaurant;
                });
                res.send(restaurants).status(400);
            })
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

module.exports = restaurantController;