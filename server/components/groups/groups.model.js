const helpers = require('../../utils/utils.helper');
const MongoDb = require('../../integrations/mongodb/mongo.connector');

COLLECTION = "groups";

class groupModel {
    constructor() {
        this.db = MongoDb.getDB();
        helpers.bindAll(this);
    }

    createGroup(group) {
        const filter = {
            $or: [
                 {group_id: group.id},
            ]
        };

        const set = {
            $set: group
        }

        db.collection('groups').findOneAndUpdate(
            filter, set, {upsert: true, returnNewDocument: true}
        );
    }


    // These can be put on the users object, however, its preferable to create these as a separate table
    createInvite(memberId, groupId) {
        const filter = {
            $or: [
                {invite_id: `${memberId}_${groupId}`}
            ]
        }

        const set = {
            $set: {
                memberId,
                groupId
            }
        }

        db.collection('invites').findOneAndUpdate(
            filter, set, {upsert: true, returnNewDocument: true}
        );
    }

    getGroup(id) {
        const query = {
            $or: [
                {id}
            ]
        };

        return MongoDB.getDB().collection(COLLECTION).findOne(query)
        .then(result => {
            return result;
        });
    }

    deleteInvite(memberId, groupId) {

    }

    deleteGroup() {
        // We don't actually want to delete the group mark the group as deleted though
        // TODO: return something?
    }
}

module.exports = groupModel;
