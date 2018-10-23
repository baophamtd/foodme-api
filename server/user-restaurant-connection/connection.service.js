const fetch = require('node-fetch');
const querystring = require('querystring');
const connectionModel = require('./connection.model');
const googleService = require('../google/google.service');
const Connection = require('./connection.object');
const WEATHER_API_KEY = 'a3a61defc8d1a149a9276e19249fd38d';

class connectionService {

    constructor() {

    }

    //user place_id for restaurant
    takeAction({lat, lng, userID, restaurantID, action, date, time}) {
        let temperature = this.getTemperature(lat, lng);
        let distance = googleService.getSingleDistance({lat, lng, place_id:restaurantID});
        let busyHour = googleService.getBusyHour({place_id: restaurantID, date: 'Mon', time: '13'});

        return Promise.all([temperature, distance, busyHour])
            .then(results =>{
              //console.log(results[2]);
              let connection  = new Connection({
                userID: userID,
                restaurantID: restaurantID,
                action: action,
                userLocation: {lat: lat, lng: lng},
                date: date,
                time: time,
                temperature: results[0],
                distance: results[1],
                busyHour: results[2] || null,
              })
              return connectionModel.insertSingleConnection(connection);

            })
    }

    getTemperature(lat, lng){
      let end_point = "https://api.openweathermap.org/data/2.5/weather?";
      let query = {
        lat: lat,
        lon: lng,
        appid: WEATHER_API_KEY,
      }

      let url = `${end_point}${querystring.stringify(query)}`;
      return fetch(url)
      .then(result => result.json())
      .then(responseJSON =>{
        return responseJSON.main;
      })
    }

}


module.exports = new connectionService();
