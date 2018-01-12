const fetch = require('node-fetch');
const querystring = require('querystring');
const apiToken = config.FACEBOOK.API_TOKEN;
const apiEndPoint = config.FACEBOOK.END_POINT;

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
        if(json.data.is_valid) {
          return true;
        }
        logger.log(json);
        return false;
      });
  }
}

module.exports = new facebookService();
