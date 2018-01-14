const restaurantModel = require('./restaurant.model');
const Promise = require("bluebird");

class restaurantService {

    constructor() {

    }    

    createRestaurant(restaurant) {
        return restaurantModel.createRestaurant(restaurant);
    }

    getRestaurant(restaurant) {
        return restaurantModel.getRestaurant(restaurant);
    }

    deleteRestaurant(restaurant) {

    }


}

module.exports = new restaurantService();
