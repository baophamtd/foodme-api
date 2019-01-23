class Connection {
    constructor({
        userId,
        restaurantId,
        action,
        userLocation,
        date,
        time,
        temperature,
        distance,
    }) {
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.action = action;
        this.userLocation = userLocation;
        this.date = date;
        this.time = time;
        this.temperature = temperature;
        this.distance = distance;
    }
}

module.exports = Connection;
