//Lib
const fetch = require('node-fetch');
const querystring = require('querystring');
const googleConnector = require('./google.connector');
const apiEndPoint = config.GOOGLE.MAPS.END_POINT;
const apiToken = config.GOOGLE.MAPS.API_TOKEN;
const restaurantService = require('../restaurant/restaurant.service');

class googleService {
    constructor() {

    }

    //seach the place found in Yelp on Google API
    //because Yelp Query Rate per Second is only 5
    getAvailablePlaceID({restaurants, lat, lng, radius}){
      let query = {
          key: apiToken,
          fields: 'place_id',
          inputtype: 'textquery'
      };
      //console.log(restaurants.length);
      var promises = restaurants.map((restaurant) => {
          if(!restaurant.in_db){
            query.input = restaurant.name;
            let searchUrl = `${apiEndPoint}/findplacefromtext/json?${querystring.stringify(query)}&locationbias=cirle:${radius}@${lat},${lng}`;

            return fetch(searchUrl)
            .then(searchResults => searchResults.json())
            .then((response) => {
              if(response.status !== 'ZERO_RESULTS'){
                restaurant.place_id = response.candidates[0].place_id;
              }
              //console.log(restaurant)
              return restaurant;
            })
          }else{
            return restaurant;
          }
      });

      return Promise.all(promises).then(results => {
        return results;
      });

    }

    getPhotoUrls({restaurants, maxWidth, maxHeight}) {

        let query = {
            key: apiToken,
            maxwidth: maxWidth || 1000,
            maxheight: maxHeight || 1000,
            fields: 'photo'
        };

        var promises = restaurants
            .filter(function(restaurant) {
                if (restaurant.place_id == null) {
                  return false; // skip
                }
                return true;
            })
            .map((restaurant) => {
                if(!restaurant.in_db){
                  query.place_id = restaurant.place_id;
                  let photoUrl = `${apiEndPoint}/details/json?${querystring.stringify(query)}`;
                  return fetch(photoUrl)
                  .then(photoResults => photoResults.json())
                  .then((response) => {
                    if(restaurant.image_url != null){
                      restaurant.image_url = response.result.photos;
                    }else{
                      restaurant.photos = response.result.photos;
                    }
                    return restaurant;
                  })
                }else{
                  console.log(`${restaurant.name} in DB`);
                  return restaurant;
                }
            });

        return Promise.all(promises).then(results => {
          return results;
        });
    }

    getPlaces({lng, lat, radius, minPrice, maxPrice}) {
        let type = "restaurant";

        let query = {
            key : apiToken,
            location : `${lat},${lng}`,
            radius,
            type,
            keyword : "",
            minPrice,
            maxPrice
        };

        let url = `${apiEndPoint}/nearbysearch/json?${querystring.stringify(query)}`;
        return fetch(url)
            .then(res => res.json())
            .catch(err => {
                console.log("Failed to retrieve data", err);
            })
    }
}

module.exports = new googleService();
