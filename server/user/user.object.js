class User {
    constructor({
        //user's info
        id,
        firstName,
        lastName,
        gender,
        country,
        city,
        age,
        //ex mm/dd/yyyy or mm/dd
        birthday,

        //access token
        facebookToken,

        //array json web token
        foodmeTokens,

        //list of restaurant id's
        restaurantList
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.country = country || null;
        this.city = city || null;
        this.age = age || -1;
        this.birthday = birthday || null;
        this.facebookToken = facebookToken || null;
        this.foodmeTokens = foodmeTokens || [];
        this.restaurantList = restaurantList || []
    }
}

module.exports = User;