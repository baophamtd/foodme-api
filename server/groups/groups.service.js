const GroupModel = require('./groups.model');
const Group = require('./group.object')

class groupService {
    constructor() {
    }

    getUser(groupIds) {
        return GroupModel.getGroups(groupsIds)
            .then(json => jsonToGroup)
    }

    updateGroup(groupId, groupData) {

    }
}

function jsonToGroup(json) {
    return new Group(json);
}

module.exports = groupService;
