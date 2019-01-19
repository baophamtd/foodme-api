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

        //fb user_id
        facebookId,

        //access token
        facebookToken,

        //expiry date
        facebookTokenExpiryDate,

        //array json web token
        foodmeTokens,

        //list of restaurant id's
        wentToRestaurantList,
        likedRestaurantList,
        dislikedRestaurantList,
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.country = country || null;
        this.city = city || null;
        this.age = age || -1;
        this.birthday = birthday || null;
        this.facebookId = facebookId || null;
        this.facebookToken = facebookToken || null;
        this.facebookTokenExpiryDate = facebookTokenExpiryDate || null;
        this.foodmeTokens = foodmeTokens || [];
        this.wentToRestaurantList = wentToRestaurantList || [];
        this.likedRestaurantList = likedRestaurantList || [];
        this.dislikedRestaurantList = dislikedRestaurantList || [];
    }
}

module.exports = User;
