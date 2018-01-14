const express = require('express');
const router = express.Router();

//Routers
let userRouter = require('./user/user.routes');
let restaurantRouter = require('./restaurant/restaurant.routes');

//Attach routers
router.use('/user', userRouter);
router.use('/restaurant', restaurantRouter);


module.exports = router;
