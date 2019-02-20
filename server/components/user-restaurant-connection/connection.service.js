const fetch = require('node-fetch');
const querystring = require('querystring');
const connectionModel = require('./connection.model');
const googleService = require('../../integrations/google/google.service');
const Connection = require('./connection.object');
const WEATHER_API_KEY = 'a3a61defc8d1a149a9276e19249fd38d';

class connectionService {

    constructor() {

    }

    //user place_id for restaurant
    takeAction({lat, lng, userID, restaurantID, action, date, time, distance}) {
        let temperature = this.getTemperature(lat, lng);

        return Promise.all([temperature])
            .then(results =>{
              let connection  = new Connection({
                user_id: userID,
                restaurant_id: restaurantID,
                action: action,
                location: {lat: lat, lng: lng},
                date: date,
                time: time,
                temperature: results[0],
                distance: JSON.parse(distance),
              })
              return connectionModel.insertConnection(connection);

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
