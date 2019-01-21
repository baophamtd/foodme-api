const express = require('express');
const router = express.Router();

// Routers
let userRouter = require('./components/user/user.routes');
let restaurantRouter = require('./components/restaurant/restaurant.routes');
let groupsRouter = require('./components/groups/groups.routes');
let connectionRouter = require('./components/user-restaurant-connection/connection.routes');

// Middlewares
let authMiddleware = require('./auth/auth.middleware');

// Apply middlewares
authMiddleware(router);

// Attach routers
router.use('/user', userRouter);
router.use('/restaurant', restaurantRouter);
router.use('/groups', groupsRouter);
router.use('/connection', connectionRouter);

module.exports = router;
