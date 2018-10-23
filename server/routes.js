const express = require('express');
const router = express.Router();

//Routers
let userRouter = require('./user/user.routes');
let restaurantRouter = require('./restaurant/restaurant.routes');
let connectionRouter = require('./user-restaurant-connection/connection.routes');

//Attach routers
router.use('/user', userRouter);
router.use('/restaurant', restaurantRouter);
router.use('/connection', connectionRouter);

module.exports = router;
