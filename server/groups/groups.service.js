const GroupModel = require('./groups.model');
const Group = require('./group.object')

class groupService {
    constructor() {
    }

    getUser(groupIds) {
        return GroupModel.getGroups(groupsIds)
            .then(json => jsonToGroup)
    }

    createGroup({groupName, invites, members, userId}) {
        let group = Group({
            owner: userId,
            name: groupName,
            members: members,
            invited: invites,
            creationDate: new Date().getTime(),
        })
        return GroupModel.createGroup(group)
        .then(success => {
            return group;
        })
        .catch(err => {
            return false;
        })
    }

    updateGroup(groupId, groupData) {

    }

    sendGroupInvite(userId) {

    }
}

function jsonToGroup(json) {
    return new Group(json);
}

module.exports = groupService;
