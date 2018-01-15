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
      this.country = country;
      this.city = city;
      this.age = age;
      this.birthday = birthday;
      this.facebookToken = facebookToken;
      this.foodmeTokens = foodmeTokens;
      this.restaurantList = restaurantList
    }
}

module.exports = User;
