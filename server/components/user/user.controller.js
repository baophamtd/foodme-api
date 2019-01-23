const userService = require('./user.service');
const restHelper = require('../../rest/rest.helper');

class userController {

  constructor() {
      this.createUser = this.createUser.bind(this);
  }

  getUser(req, res) {
    userService.getUser(req.params.id)
    .then(user => {
      res.send(user);
    });
  }

  createUser(req, res) {
    let {facebook_id, short_lived_token} = req.body;
    console.log(facebook_id);
    return userService.createUser(facebook_id, short_lived_token)
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

}

module.exports = new userController();
