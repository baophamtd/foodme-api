//Libs
const express = require('express');
const router = express.Router();

const restaurantController = new require('./restaurant.controller');

//Controllers
const controller = new restaurantController();

router.get('/search', controller.getRestaurants);
router.get('/lookup', controller.lookupRestaurant);
router.get('/:id', controller.getRestaurant);

router.post('/like/:id', controller.likeRestaurant);
router.post('/dislike/:id', controller.dislikeRestaurant);
router.post('/favorite/:id', controller.favoriteRestaurant);

module.exports = router;
