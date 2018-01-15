const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const facebookService = require('../facebook/facebook.service');
const userService = require('./user.service');
const User = require('./user.object');

class userController {


  createUser(req, res) {
    
      //Takes a facebook token as input
      let facebookToken = req.body.facebookToken;
      let user = new User(req.body);
      //Retrieves data from facebookToken
      facebookService.verifyAccessToken(facebookToken)
        .then(valid => {
          if(valid) {
            //Creates user
            let id = shortid.generate();
            user.id = id;
            let token = jwt.sign({user}, config.INTERNAL.SECRET_KEY,{ expiresIn: '1h' });
            user.foodmeTokens.push(jwt.sign({user}, config.INTERNAL.SECRET_KEY));
            userService.createUser(user);
            res.send("User successfully created").status(200);
          } else {
            res.send("Failed to verify user").status(401);
          }
        })
        .catch(err => {
          logger.error("Failed to create user", err);
          res.send("Create user error. " +  err).status(500);
        })

      //Add user to db

      //Return success/failure
  }

  getUserInfo(req, res) {

  }
}

module.exports = new userController();
