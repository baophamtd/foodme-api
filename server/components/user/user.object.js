class User {
    constructor({
        //user's info
        id,
        first_name,
        last_name,
        gender,
        country,
        city,
        age,
        //ex mm/dd/yyyy or mm/dd
        birthday,

        //fb user_id
        facebook_id,

        //access token
        facebook_token,

        //expiry date
        facebook_token_expiry_date,

        //array json web token
        foodme_tokens,

        // groups that the user is a member of
        groups,

        //list of restaurant id's
        went_to_restaurants,
        liked_restaurants,
        disliked_restaurants,
    }) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.gender = gender;
        this.country = country || null;
        this.city = city || null;
        this.age = age || null;
        this.birthday = birthday || null;
        this.facebook_id = facebook_id || null;
        this.facebook_token = facebook_token || null;
        this.facebook_token_expiry_date = facebook_token_expiry_date || null;
        this.foodme_tokens = foodme_tokens || [];
        this.groups = groups || [];
        this.went_to_restaurants = went_to_restaurants || [];
        this.liked_restaurants = liked_restaurants || [];
        this.disliked_restaurants = disliked_restaurants || [];
    }
}

module.exports = User;
