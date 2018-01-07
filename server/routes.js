const express = require('express');
const router = express.Router();

//Routers
let userRouter = require('./user/user.routes.js');
let restaurantRouter = require('./restaurant/restaurant.routes.js');

//Attach routers
router.use('/user', userRouter);
router.use('/restaurants', restaurantRouter);


module.exports = router;