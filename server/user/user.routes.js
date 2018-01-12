//Libs
const express = require('express');
const router = express.Router();

//controllers
const userController = require('./user.controller');

//Create User
router.post('/', userController.createUser);



module.exports = router;
