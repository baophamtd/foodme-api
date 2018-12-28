const uniqid = require('uniqid');

class Group {
    constructor({
      owner, // user id
      members, // user id's
      invited,
      id,
      name,
      creationDate,
      lastUpdated,
      history, // Previous places attended by the group
      attendance, // What users have attended previous events
      settings, // Will likely need to include properties like (ENUM healthy, kosher, vegan, vegetarian similar)
    }) {
      this.owner = owner;
      this.members = members;
      this.invited = invited;
      this.id = id || uniqid('group-')
      this.name = name;
      this.creationDate = creationDate || new Date().getTime();
      this.lastUpdated = lastUpdated;
      this.history = history || [];
      this.attendance = attendance || [];
      this.settings = settings || [];
    }
  }

  module.exports = Group;
