//Lib
const fetch = require('node-fetch');
const querystring = require('querystring');
const Promise = require("bluebird");
const busyHours = require('busy-hours');  //this library scraping google data
const googleConnector = require('./google.connector');
const apiEndPoint = config.GOOGLE.MAPS.END_POINT;
const apiToken = config.GOOGLE.MAPS.API_TOKEN;

class googleService {
    constructor() {

    }

    //seach the place found in Yelp on Google API
    //because Yelp Query Rate per Second is only 5
    getAvailablePlaceId({restaurants, lat, lng, radius}){
      let query = {
          key: apiToken,
          fields: 'place_id',
          inputtype: 'textquery'
      };
      //console.log(restaurants.length);
      var promises = restaurants.map((restaurant) => {
          if(!restaurant.in_db){
            query.input = restaurant.name;
            let searchUrl = `${apiEndPoint}/place/findplacefromtext/json?${querystring.stringify(query)}&locationbias=cirle:${radius}@${lat},${lng}`;
            return fetch(searchUrl)
            .then(searchResults => searchResults.json())
            .then((response) => {
              if(response.status !== 'ZERO_RESULTS'){
                restaurant.place_id = response.candidates[0].place_id;
              }
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
        //console.log(restaurants);
        var promises = restaurants
            /*
            .filter(function(restaurant) {
                if (restaurant.place_id == null) {
                  return false; // skip
                }
                return true;
            })*/
            .map((restaurant) => {
                if(!restaurant.in_db){
                  query.place_id = restaurant.place_id;
                  let photoUrl = `${apiEndPoint}/place/details/json?${querystring.stringify(query)}`;
                  return fetch(photoUrl)
                  .then(photoResults => photoResults.json())
                  .then((response) => {
                    if(response.result === undefined){
                      console.log(response);
                    }
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

        let url = `${apiEndPoint}/place/nearbysearch/json?${querystring.stringify(query)}`;
        return fetch(url)
            .then(res => res.json())
            .catch(err => {
                console.log("Failed to retrieve data", err);
            })
    }

    //this might be illegal
    getBusyHours(restaurants){
      var promises = restaurants.map((restaurant) => {
        if(!restaurant.in_db){
          return busyHours(restaurant.place_id, apiToken)
          .then(data => {
              if(data.week !== null){
                restaurant.busy_hours = data.week;
              }
              return restaurant;
           })
         }else{
           return restaurant;
         }
      })

      return Promise.all(promises).then(results => {
        return results;
      });

    }

    getDistances({lat, lng, restaurants}){
      console.log(restaurants.length)
      let query = {
        key: apiToken,
        units: 'imperial',
        origins: `${lat},${lng}`,
        departure_time: 'now',
        traffic_model: 'best_guess',
      }

      let promises = restaurants.map(restaurant => {
        if(restaurant.in_db){
          restaurant.place_id = restaurant.place_id;
        }
        query.destinations = `place_id:${restaurant.place_id}`;
        let url = `${apiEndPoint}/distancematrix/json?${querystring.stringify(query).replace('%2C',',').replace('%3A',':')}`;
        return fetch(url)
          .then(res =>res.json())
          .then(responseJSON =>{
            if(!responseJSON.rows[0]){
              console.log(restaurant.name);
            }
            let distance = responseJSON.rows[0].elements[0].distance;
            let duration = responseJSON.rows[0].elements[0].duration;
            let durationInTraffic = responseJSON.rows[0].elements[0].duration_in_traffic;
            let result = {
              distance,
              duration,
              durationInTraffic
            }
            restaurant.distance = result;
            return restaurant;
          })
      })

      return Promise.all(promises).then(results => {
        return results;
      });

    }

    getNextPage(nextPageToken){
      let query = {
        key: apiToken,
        pagetoken: nextPageToken,
      }
      let url = `${apiEndPoint}/place/nearbysearch/json?${querystring.stringify(query)}`;
      console.log(url);
      return fetch(url)
            .then(res => res.json())
            .catch(err => {
                console.log("Failed to retrieve next page data", err);
            })
    }
}

module.exports = new googleService();
