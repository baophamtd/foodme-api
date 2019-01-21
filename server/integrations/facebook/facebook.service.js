const fetch = require('node-fetch');
const querystring = require('querystring');
const apiToken = config.FACEBOOK.API_TOKEN;
const apiEndPoint = config.FACEBOOK.END_POINT;
const appId = config.FACEBOOK.APP_ID;
const appSecret = config.FACEBOOK.APP_SECRET;


class facebookService {

  verifyAccessToken(token){
    let query = {
      access_token : apiToken,
      input_token : token
    }

    let url = `${apiEndPoint}/debug_token?${querystring.stringify(query)}`;

    return fetch(url)
      .then(result => result.json())
      .then(json => {
        console.log(json);
        if(json.data && json.data.is_valid) {
          //return user_id if valid
          return json.data.user_id;
        }
        logger.log(json);
        //or else return false
        return false;
      });
  }

  getLongLivedToken(shortLivedToken){
    let query = {
      grant_type: 'fb_exchange_token',
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortLivedToken
    }

    let url = `${apiEndPoint}/oauth/access_token?${querystring.stringify(query)}`;
    return fetch(url)
      .then(result => result.json())
      .catch(err => {
        console.log("Failed to obtain FB long lived token", err);
      });

  }

  getUserPublicProfile(facebookId, accessToken){
    let query = {
      fields: 'first_name,last_name,email,birthday,gender,hometown,location',
      access_token: accessToken
    }
    let url = `${apiEndPoint}/${facebookId}?${querystring.stringify(query)}`;
    return fetch(url)
      .then(result => result.json())
      .catch(err => {
        console.log("Failed to obtain FB public profile", err);
      });

  }

}

module.exports = new facebookService();
