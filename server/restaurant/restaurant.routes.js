//Libs
const express = require('express');
const router = express.Router();

const restaurantController = new require('./restaurant.controller');

//Controllers
const controller = new restaurantController();

router.get('/search', controller.getRestaurants);
router.get('/:id', controller.getRestaurant);

module.exports = router;