const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

// router.get('/', userController.getUserInfo);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/all', userController.fetchUser);
router.post('/following', userController.fetchFollowingUser);

router.patch('/follow', userController.followUser);
router.patch('/image', userController.postImageUrl);

module.exports = router;
