let db = require('../aws/dynamo.dynasty.connector');
let restaurants = db.table('Restaurants');

class restaurantModel {

    constructor() {

    }

    updateRestaurant(id, update) {
        return restaurants.update(id, update);
    }

    createRestaurant(restaurant) {       
        return restaurants.insert(restaurant);
    }

    getRestaurant(id) {
        return restaurants.find(id);
    }
}

module.exports = new restaurantModel();
