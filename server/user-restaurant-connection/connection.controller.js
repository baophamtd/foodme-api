const connectionService = require('./connection.service');
const restHelper = require('../rest/rest.helper');
const Promise = require('bluebird');

class connectionController {
    constructor() {
        this.takeAction = this.takeAction.bind(this);
    }

    takeAction(req, res) {
        let {lat, lng, userID, restaurantID, action, date, time, distance} = req.body;
        return connectionService.takeAction({lat, lng, userID, restaurantID, action, date, time, distance})
            .then(result => {
              (result != 0) ? res.send("success") : res.send("failure");
            })
            .catch(err => {
                res.send("Failure: " + err).status(400);
            })
    }
}

module.exports = new connectionController();
