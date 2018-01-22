const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const facebookService = require('../facebook/facebook.service');
const userService = require('./user.service');
const User = require('./user.object');

class userController {

  //Linkedin

  //Facebook
  /*
    Two different verification phases
    identical user creation
  */

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
                let id = uuidv4();
                user.id = id;
                user.id = facebookId;
                let token = jwt.sign({user}, config.INTERNAL.SECRET_KEY,{ expiresIn: '1h' });
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
                res.send("failed to retrieve user").status(200);
              });
        })
        .catch(err => {
          res.send("Failed to verify user").status(403);
        });
/*
      //Retrieves data from facebookToken
      facebookService.verifyAccessToken(facebookToken)
        .then(facebookId => {
            if(facebookId) {

              if(userService.getUser(facebookId))
              console.log(facebookId);
              console.log(userService.getUser(facebookId));
              //Creates user
              user.facebookId = facebookId;
              let id = uuidv4();
              user.id = id;
              let token = jwt.sign({user}, config.INTERNAL.SECRET_KEY,{ expiresIn: '1h' });
              user.foodmeTokens.push(jwt.sign({user}, config.INTERNAL.SECRET_KEY));
              userService.createUser(user)
                .then(result => {
                  res.send("User successfully created").status(200);
                })
                .catch(err => {
                  res.send("Failed to create user").status(400);
                })
          }else{
            res.send("Failed to verify user").status(401);
          }
        })
        .catch(err => {
          logger.error("Failed to create user", err);
          res.send("Create user error. " +  err).status(500);
        })
*/
      //Add user to db

      //Return success/failure
  }

  getUserInfo(req, res) {

  }
}

module.exports = new userController();
