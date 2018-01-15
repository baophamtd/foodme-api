const apiToken = config.YELP.API_TOKEN;
const yelp = require('yelp-fusion');

const client = yelp.client(apiToken);

class yelpService {

    constuctor() {
        
    }

    searchForRestaurants({lng, lat, radius, minPrice}){                 
        return client.search({
            latitude: lat,
            longitude: lng,
            price: minPrice,
            radius,
            term: "restaurants"
        });  
    }
}

module.exports = new yelpService();