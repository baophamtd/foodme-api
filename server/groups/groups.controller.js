const Group = require('./group.object');
const GroupService = require('/group.service');

// Incase localization is needed
const FAILED_TO_FIND_USER = "Failed to find user";

/**
 * All group data absolutley needs to be persisted, similar to user data this data is absolutley critical for the app to function in a future state
 *
 * TODO:
 *
 *
 */
class groupController {
    constructor() {

    }


    /**
     * Retrieve information about a specific group
     * @method POST
     * @param {int} id
     * @returns {Group} the group with the corresponding id, or a 404
     **/
    getGroups(req, res) {
        const userId = req.params.id;
        GroupService.get([userId])
            .then(user => stripUser)
            .then(strippedUser => {
                res.json(strippedUser);
            })
            .catch(err => {
                res.status(404);
                res.send(FAILED_TO_FIND_USER);
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

function stripUser(User) {
 return {
     'userId': user.id
 }
}

module.exports = groupController;
