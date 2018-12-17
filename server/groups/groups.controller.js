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
    constructor() {

    }


    /**
     * Retrieve information about a list of groups
     * @method POST
     * @param {int} id
     * @returns {Group} the group with the corresponding id, or a 404
     **/
    getGroups(req, res) {
        const userId = req.params.id;
        GroupService.get([userId])
            .then(groups => stripGroups)
            .then(strippedGroups => {
                res.json(strippedGroups);
                logger.log(`returned information for ${strippedGroups.length} groups`);
            })
            .catch(err => {
                res.status(404);
                res.send("Failed to find the specified group.");
            })
        return "getGroups";
    }

    /**
     * Create a new group with the provided parameters
     * @param {Group} information relating to the new group
     * @returns {boolean} if the group has been successfully created
     */
    createGroup(req, res) {

        return "createGroup";
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
