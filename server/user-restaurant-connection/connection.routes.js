//Libs
const express = require('express');
const router = express.Router();

//controllers
const connectionController = require('./connection.controller');

//like a restaurant
router.post('/action', connectionController.takeAction);



module.exports = router;
