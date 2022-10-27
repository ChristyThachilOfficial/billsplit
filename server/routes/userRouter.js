const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')


router.post('/signup',userController.doSignup);
router.post('/login', userController.doLogin)
router.get('/friends',userController.getFriends)

module.exports = router