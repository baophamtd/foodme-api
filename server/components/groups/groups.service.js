const GroupModel = require('./groups.model');
const UserService = require('../user/user.service');
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

    addGroupToUser(groupId, userId) {

    }

    getGroup(id) {
        return GroupModel.getGroup(id);
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
