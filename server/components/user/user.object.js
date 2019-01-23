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

        // groups that the user is a member of
        groups,

        //list of restaurant id's
        wentToRestaurants,
        likedRestaurants,
        dislikedRestaurants,
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
        this.groups = groups || [];
        this.wentToRestaurants = wentToRestaurants || [];
        this.likedRestaurants = likedRestaurants || [];
        this.dislikedRestaurants = dislikedRestaurants || [];
    }
}

module.exports = User;
