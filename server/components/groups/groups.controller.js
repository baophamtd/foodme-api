const Group = require('./group.object');
const GroupService = require('./groups.service');

/**
 * All group data absolutley needs to be persisted, similar to user data this data is absolutley critical for the app to function in a future state
 *
 * TODO: Implement all the methods!!
 *
 *
 */
class groupController {

    /**
     * Retrieve information about a list of groups
     * @method POST
     * @param {array:int} id
     * @returns {Group} the group with the corresponding id, or a 404
     **/
    getGroups(req, res) {
        const {id} = req.params;
        GroupService.get(id)
            .then(groups => stripGroups)
            .then(strippedGroups => {
                res.json(strippedGroups);
                logger.log(`returned information for ${strippedGroups.length} groups`);
            })
            .catch(err => {
                res.status(404);
                res.send("Failed to find the specified group.");
            })
    }

    /**
     * Create a new group with the provided parameters
     * @param {Group} information relating to the new group
     * @returns {boolean} if the group has been successfully created
     */
    createGroup(req, res) {
        let { groupName, invites, userId } = req.params;
        let members = [userId];

        GroupsService.createGroup({groupName, invites, members, userId})
        .then(group => {
            const sendInvites = GroupService.sendInvites(invites);
            const addGroupToUser = GroupService.addGroupToUser(userId, group);
            Promise.all([sendInvites, addGroupToUser])
            .then(() => {
                res.status(200);
                res.send("Group Created.");
            })
            .catch(err => {
                logger.err("Failed to create group", err);
            })

        })
        .catch(err => {
            res.status(409);
            res.send("")
        });
    }


    /**
     * Invite users to be members of a group
     * @param {int} Group id that users will be invited to
     * @param {array:int} users that should be invited to join the group
     * @returns {boolean} if the users have been successfully invited to the group
     */
    inviteToGroup(req, res) {

    }

    joinGroup(req, res) {

    }

    leaveGroup(req, res) {

    }

    getCurrentMembership(req, res) {

    }

    updateGroup(req, res) {

    }

    beginGroupSearch(req, res) {

    }

    voteForRestaruant(req, res) {

    }

    poll(req, res) {

    }

    outing(req, res) {

    }

    suggestRestaurant(req, res) {

    }

    voteForRestaurant(req, res) {

    }

    confirmRestaurant(req, res) {

    }

}

function stripGroup(groups) {
    return groups.map(group => {
        return {
            'userId': user.id,
            'username': user.first
        }
    });
}

module.exports = groupController;
