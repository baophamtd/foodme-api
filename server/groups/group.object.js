class Group {
    constructor({
      owners, // user id
      members, // user id's
      creationData,
      lastUpdated,
      history, // Previous places attended by the group
      attendance, // What users have attended previous events
      settings, // Will likely need to include properties like (ENUM healthy, kosher, vegan, vegetarian similar)
    }) {
    }
  }

  module.exports = Group;
