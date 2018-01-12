const facebookService = require('../facebook/facebook.service');

class userController {


  createUser(req, res) {
      //Takes a facebook token as input
      let token = req.body.token;

      //Retrieves data from facebookToken
      facebookService.verifyAccessToken(token)
        .then(valid => {
          if(valid) {
            res.send("User successfully verified").status(200);
          } else {
            res.send("Failed to verify user").status(401);
          }
        })
        .catch(err => {
          res.send("Service error." +  err).status(500);
        })

      //Creates user

      //Add user to db

      //Return success/failure
  }

  getUserInfo(req, res) {

  }
}

module.exports = new userController();
