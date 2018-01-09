let restaurantModelClass = require('./restaurant.model');
let restaurantModel = new restaurantModelClass();

class restaurantService {

    constructor() {

    }

    createRestaurant(restaurant) {
        
    }

    getRestaurant(restaurant) {
        return restaurantModel.createRestaurant(restaurant);
    }

    deleteRestaurant(restaurant) {
        
    }


}

module.exports = restaurantService;