//Libs
const express = require('express');
const router = express.Router();

//controllers
const userController = require('./user.controller');

//Create User
router.post('/create', userController.createUser);

// Retrieve User
router.get('/:id',userController.getUser);

//Visit a restaurant
//router.post('/visitRestaurant', userController.visitRestaurant);


module.exports = router;
