const fetch = require('node-fetch');
const querystring = require('querystring');
const connectionModel = require('./connection.model');
const googleService = require('../../integrations/google/google.service');
const Connection = require('./connection.object');

class connectionService {

    constructor() {

    }

    //user place_id for restaurant
    takeAction({lat, lng, userID, restaurantID, action, date, time, distance, temperature, busyness}) {
        let connection  = new Connection({
          user_id: userID,
          restaurant_id: restaurantID,
          action: action,
          location: {lat: lat, lng: lng},
          date: date,
          time: time,
          temperature: JSON.parse(temperature),
          distance: JSON.parse(distance),
          busyness: busyness,
        })
        //console.log(connection);
        return connectionModel.insertConnection(connection);

    }


}


module.exports = new connectionService();
