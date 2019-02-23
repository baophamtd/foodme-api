class Connection {
    constructor({
        user_id,
        restaurant_id,
        action,
        location,
        date,
        time,
        temperature,
        distance,
        busyness,
    }) {
        this.user_id = user_id;
        this.restaurant_id = restaurant_id;
        this.action = action;
        this.location = location;
        this.date = date;
        this.time = time;
        this.temperature = temperature;
        this.distance = distance;
        this.busyness = busyness;
    }
}

module.exports = Connection;
