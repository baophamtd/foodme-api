const apiToken = config.YELP.API_TOKEN;
const returnLimit = config.YELP.RETURN_LIMIT;
const yelp = require('yelp-fusion');
const querystring = require('querystring');
const client = yelp.client(apiToken);
const fetch = require('node-fetch');

class yelpService {

    constuctor() {
        this.searchForRestaurants = this.searchForRestaurants.bind(this);
        this.request = this.request.bind(this);
    }

    request({url, method, body}) {
        let options = {
            method,
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        }

        if (body) {
            options['body'] = body
        }

        return fetch(url, options)

    }

    searchForRestaurants({lng, lat, radius, minPrice}){
        let query = {
            latitude: lat,
            longitude: lng,
            radius: parseInt(radius),
            term: "restaurants",
            limit: returnLimit,
        }

        if(minPrice > 0) {
            for(i = 0; i < minPrice; i++) {
                query.price += '$'
            }
        }

        const url = `${config.YELP.URL}/businesses/search?${querystring.stringify(query)}`;
        return this.request({url, method:"GET"})
        .then(response => response.json());
    }

    getNextRestaurants({lng, lat, radius, minPrice, offset}){
      let query = {
          latitude: lat,
          longitude: lng,
          radius: parseInt(radius),
          term: "restaurants",
          limit: returnLimit,
          offset: offset
      }
      if(minPrice > 0) {
          for(i = 0; i < minPrice; i++) {
              query.price += '$'
          }
      }

      const url = `${config.YELP.URL}/businesses/search?${querystring.stringify(query)}`;
      return this.request({url, method:"GET"})
      .then(response => {
        //console.log(response);
        return response.json();
      });
    }
}

module.exports = new yelpService();
