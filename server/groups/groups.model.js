const helpers = require('../utils/utils.helper');
const MongoDb = require('../mongodb/mongo.connector');

class groupModel {
    constructor() {
        this.db = MongoDb.getDB();
        helpers.bindAll(this);
    }

    createGroup(groupData) {

    }

    deleteGroup() {
        // We don't actually want to delete the group
        // TODO: return something?
    }
}

module.exports = groupModel;
