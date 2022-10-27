const express = require('express')
const router = express.Router();
const groupController = require('../controller/groupController')


router.post('/create',groupController.createGroup);
router.get('/getgroups/:userId', groupController.getGroups)
router.get('/pendingbills/:username',groupController.getPendingBills)

module.exports = router;