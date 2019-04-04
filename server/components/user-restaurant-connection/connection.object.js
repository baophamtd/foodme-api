class Connection {
    constructor({
        user_id,
        restaurant_id,
        restaurant_price,
        restaurant_rating,
        restaurant_category,
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
        this.restaurant_price = restaurant_price;
        this.restaurant_rating = restaurant_rating;
        this.restaurant_category = restaurant_category;
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
