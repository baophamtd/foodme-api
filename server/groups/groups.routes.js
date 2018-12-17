//Libs
const express = require('express');
const router = express.Router();

const groupController = new require('./groups.controller');

//Controllers
const controller = new groupController();

// Get data of a specific group
router.get('/:id', controller.getGroups);

// Create a new user group
router.put('/create', controller.createGroup);

// Add a user or a set of users to a group
router.post('/invite', controller.inviteToGroup);

// Get the current group membership for the user
router.get('/membership', controller.getCurrentMembership);

// Update a groups data
router.put('/update', controller.updateGroup);

// begin a search
router.post('/search', controller.beginGroupSearch);

// Vote for a restaurant and trigger a runoff if needed
router.post('/search/vote', controller.voteForRestaruant);

// Poll for group status
router.get('/poll/:id', controller.poll)

module.exports = router;
