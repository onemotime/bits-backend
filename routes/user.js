const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

// router.get('/', userController.getUserInfo);
router.get('/all', userController.fetchUser);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.patch('/follow', userController.followUser);

module.exports = router;
