const uniqid = require('uniqid');

class Session {
    constructor({
      firstName,
      lastName,
      issuedOn,
      expiresOn,
      id
    }) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.validFor = validFor;
      this.issuedOn = issuedOn;
      this.expiresOn = expiresOn;
    }
  }

  module.exports = Session;
