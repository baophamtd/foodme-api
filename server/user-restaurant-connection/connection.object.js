class Connection {
    constructor({
        userID,
        restaurantID,
        action,
        userLocation,
        temperature,
        busyHour,
        distance,
    }) {
        this.userID = userID;
        this.restaurantID = restaurantID;
        this.action = action;
        this.userLocation = userLocation;
        this.temperature = temperature;
        this.busyHour = busyHour || null;
        this.distance = distance;
    }
}

module.exports = Connection;
