class Connection {
    constructor({
        userID,
        restaurantID,
        action,
        userLocation,
        date,
        time,
        temperature,
        distance,
    }) {
        this.userID = userID;
        this.restaurantID = restaurantID;
        this.action = action;
        this.userLocation = userLocation;
        this.date = date;
        this.time = time;
        this.temperature = temperature;
        this.distance = distance;
    }
}

module.exports = Connection;
