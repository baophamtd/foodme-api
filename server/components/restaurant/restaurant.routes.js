//Libs
const express = require('express');
const router = express.Router();

const restaurantController = require('./restaurant.controller');

router.get('/search', restaurantController.searchRestaurants);
router.get('/photos', restaurantController.getRestaurantPhotos)
router.get('/loadnextpage', restaurantController.loadNextPage);

router.post('/like/:id', restaurantController.likeRestaurant);
router.post('/dislike/:id', restaurantController.dislikeRestaurant);
router.post('/favorite/:id', restaurantController.favoriteRestaurant);

module.exports = router;
