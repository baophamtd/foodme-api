class Restaurant {
  constructor({
    placeId,
    id,
    name,
    country,
    state,
    city,
    address,
    zip,
    photos,
    price,
    rating,
    busyHours,
    //lat, lng
    location,
    types,
    categories,

    //Social info
    favorited,
    likes,
    dislikes,
    views,
    visits
  }) {
    this.placeId = placeId || null;
    this.id = id;
    this.name = name;
    this.location = location;
    this.country = country || null;
    this.state = state || null;
    this.city = city || null;
    this.zip = zip || null;
    this.address = address || null;
    this.price = price || 0;
    this.rating = rating || 0;
    this.busyHours = null;
    this.photos = photos || ["No Photos"];
    this.types = types || [];
    this.categories = categories || [];
    this.favorited = favorited || 0;
    this.likes = likes || 0;
    this.dislikes = dislikes || 0;
    this.views = views || 0;
    this.visits = visits || 0;
  }
}

module.exports = Restaurant;
