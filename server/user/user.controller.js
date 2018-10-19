const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const facebookService = require('../facebook/facebook.service');
const userService = require('./user.service');
const User = require('./user.object');

class userController {

  constructor() {
      this.createUser = this.createUser.bind(this);
  }

  createUser(req, res) {
    let user = new User({
      id: uniqid(),
      firstName: null,
      lastName:null,
      gender:null,
      country:null,
      city:null,
      age:null,
      //ex mm/dd/yyyy or mm/dd
      birthday:null,

      //fb user_id
      facebookId:null,

      //access token
      facebookToken:null,

      //array json web token
      foodmeTokens: [],

      //list of restaurant id's
      wentToRestaurantList:[],
      likedRestaurantList:[],
      dislikedRestaurantList:[],
    });
    return userService.createUser(user)
    .then((result) =>{
      (result == 1) ? res.send("User Created") : res.send("User Existed");
    })
  }
    /*
    createUser(req, res) {
      //Takes a facebook token as input
      let facebookToken = req.body.facebookToken;
      let user = new User(req.body);

      //User needs to know that they are verified.
      //Client shouldnt wait for the user to be created
      facebookService.verifyAccessToken(facebookToken)
        .then(facebookId => {
          userService.getUser(facebookId)
            .then(user => {
              if(user) {
                console.log(user);
                res.send("User Verified");
              } else {
                //Generate unique user id
                let id = uuidv4();
                user.id = id;
                user.facebookId = facebookId;
                let token = jwt.sign({userId:user.id, firstName:user.firstName, userId:user.lastName}, config.INTERNAL.SECRET_KEY,{ expiresIn: '720h' });
                user.foodmeTokens.push(jwt.sign({user}, config.INTERNAL.SECRET_KEY));
                userService.createUser(user)
                  .then(result => {
                    res.send("User verified and successfully created").status(200);
                  })
                  .catch(err => {
                    res.send("Failed to create user").status(200);
                  });
                }
              })
              .catch(err => {
                res.send("Failed to retrieve user").status(200);
              });
        })
        .catch(err => {
          res.send("Failed to verify user").status(403);
        });

      }

      visitRestaurant(req, res){
        let {token, restaurantId} = req.query;
        var decoded = jwt.verify(token, config.INTERNAL.SECRET_KEY);
        userService.getUser(decoded.userId)
        .then(user => {
            let restaurant = user.restaurantList.filter(restaurant => {
              if(restaurants.id === restaurantId) {
                return true;
              }
              return false;
            });

            if(restaurant) {
              restaurant++;
            } else {
              user.restaurantList.push(new Restaurant({
                id: restaurantId,
                visits: 1
              }));
            }

            //serialize the user
            return userService.updateUser(user);
        })
        .then(result => {

        })
        .catch(err => {
        });
      }
      */
}

module.exports = new userController();
