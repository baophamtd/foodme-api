let db = require('../aws/dynamo.dynasty.connector');
let restaurants = db.table('Restaurants');

class restaurantModel {

    constructor() {

    }

    createRestaurant(restaurant) {       
        return restaurants.insert(restaurant);
    }

    getRestaurant(query) {
        return restaurants.find(query);
    }
}

module.exports = new restaurantModel();
