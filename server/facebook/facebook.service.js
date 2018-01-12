const fetch = require('node-fetch');
const querystring = require('querystring');
const apiKey = config.FACEBOOK.API_TOKEN;

class facebookService {

  verifyAccessToken(token){
    let query = {
      access_token : apiKey,
      input_token : token
    }

    let url = `https://graph.facebook.com/debug_token?${querystring.stringify(query)}`;

    return fetch(url)
      .then(result => result.json())
      .then(json => {
        console.log(json);
        if(json.data.is_valid) {
          return true;
        }
        return false;
      });
  }
}

module.exports = new facebookService();
