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
                  let photoUrl = `${apiEndPoint}/place/details/json?${querystring.stringify(query)}`;
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

        let url = `${apiEndPoint}/place/nearbysearch/json?${querystring.stringify(query)}`;
        return fetch(url)
            .then(res => res.json())
            .catch(err => {
                console.log("Failed to retrieve data", err);
            })
    }

    //first 3 chars of date must contain acronym for day and first 2 digits of time must be hour in 24h
    getBusyHour({place_id, date, time}){
      return busyHours(place_id, apiToken).then(data => {
        /*
          let busyHour = data.week
          .filter(element =>{
              return element.day === date.substring(0,3);
          })[0].hours
          .filter(element =>{
            return element.hour == time;
          })[0]

          console.log(busyHour);
          return busyHour;
          */
          return data.week;

       });
    }

    getSingleDistance({lat, lng, place_id}){
      let query = {
        key: apiToken,
        units: 'imperial',
        origins: `${lat},${lng}`,
        destinations: `place_id:${place_id}`,
        departure_time: 'now',
        traffic_model: 'best_guess',
      }

      let url = `${apiEndPoint}/distancematrix/json?${querystring.stringify(query).replace('%2C',',').replace('%3A',':')}`;
      return fetch(url)
        .then(res =>res.json())
        .then(responseJSON =>{
          let distance = responseJSON.rows[0].elements[0].distance;
          let duration = responseJSON.rows[0].elements[0].duration;
          let durationInTraffic = responseJSON.rows[0].elements[0].duration_in_traffic;
          let result = {
            distance,
            duration,
            durationInTraffic
          }
          return result;
        })
    }
}

module.exports = new googleService();
