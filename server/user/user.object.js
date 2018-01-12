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

      //json web token
      foodmeToken,

      //list of restaurant id's
      restaurantList
    }) {}
}

module.exports = User;
