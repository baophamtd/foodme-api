const userModel = require('./user.model');
const facebookService = require('../facebook/facebook.service');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const moment = require('moment');
const Promise = require('bluebird');
const User = require('./user.object');

class userService {

    constructor() {

    }

    createUser(facebookId, shortLivedToken) {

      let facebookToken, facebookTokenExpiryDate;

      return facebookService.getLongLivedToken(shortLivedToken)
        .then(longLivedToken => {
          facebookToken = longLivedToken.access_token;
          facebookTokenExpiryDate = moment().add(longLivedToken.expires_in, 'seconds').format('lll');
          return facebookService.getUserPublicProfile(facebookId, longLivedToken.access_token);
        })
        .then(userProfile =>{
          let user = new User({
            id: uniqid(),
            firstName: userProfile.first_name,
            lastName: userProfile.last_name,
            gender: userProfile.gender || null,
            country: userProfile.hometown || null,
            city:userProfile.hometown || null,
            age: moment().diff(userProfile.birthday, 'years') || null,
            //ex mm/dd/yyyy or mm/dd
            birthday:userProfile.birthday || null,

            //fb user_id
            facebookId:facebookId,

            //access token
            facebookToken:facebookToken,

            //fb token expiry date
            facebookTokenExpiryDate: facebookTokenExpiryDate,

            //array json web token
            foodmeTokens: [],

            //list of restaurant id's
            wentToRestaurantList:[],
            likedRestaurantList:[],
            dislikedRestaurantList:[],
          });
          return userModel.createUser(user);
        })
        .then(id =>{
          return {"id":id, "token":facebookToken};
        })
        .catch(err => {
            console.log("Cannot create user!", err);
        });

    }

    getUser(facebookId) {
        return userModel.getUser(facebookId);
    }

    deleteUser(restaurant) {

    }


}

module.exports = new userService();
