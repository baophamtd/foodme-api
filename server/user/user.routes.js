//Libs
const express = require('express');
const router = express.Router();

//controllers
const userController = require('./user.controller');

//Create User
router.post('/createUser', userController.createUser);

//Visit a restaurant
router.post('/visitRestaurant', userController.visitRestaurant);


module.exports = router;
