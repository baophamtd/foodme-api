const express = require('express');
const router = express.Router();

//Routers
let userRouter = require('./user/user.routes');
let restaurantRouter = require('./restaurant/restaurant.routes');
let groupsRouter = require('./groups/groups.routes');
let connectionRouter = require('./user-restaurant-connection/connection.routes');

//Attach routers
router.use('/user', userRouter);
router.use('/restaurant', restaurantRouter);
router.use('/groups', groupsRouter);
router.use('/connection', connectionRouter);

module.exports = router;
