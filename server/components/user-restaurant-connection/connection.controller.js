const connectionService = require('./connection.service');
const restHelper = require('../../rest/rest.helper');
const Promise = require('bluebird');

class connectionController {
    constructor() {
        this.takeAction = this.takeAction.bind(this);
    }

    takeAction(req, res) {
        let {lat, lng, user_id, restaurant_id, restaurant_price, restaurant_rating, restaurant_category, action, date, time, distance, temperature, busyness} = req.body;
        return connectionService.takeAction({lat, lng, user_id, restaurant_id, restaurant_price, restaurant_rating, restaurant_category, action, date, time, distance, temperature, busyness})
            .then(result => {
              (result != 0) ? res.send("success") : res.send("failure");
            })
            .catch(err => {
                res.send("Failure: " + err).status(400);
            })
    }
}

module.exports = new connectionController();
