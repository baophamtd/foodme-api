const userService = require('./user.service');
const restHelper = require('../rest/rest.helper');

class userController {

  constructor() {
      this.createUser = this.createUser.bind(this);
  }

  createUser(req, res) {
    let {facebook_id, short_lived_token} = req.body;

    return userService.createUser(facebook_id, short_lived_token)
    /*.then((result) =>{
      (result != 0) ? res.send({"id":result}) : res.send("User Existed");
    })*/
    .then(result => {
        if(result)
            res.send(restHelper.buildResponse(null, result));
        else
            res.send(restHelper.buildResponse(null, [])).status(404);
    })
    .catch(err => {
        res.send(restHelper.buildResponse(err, [])).status(500);
    });
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
