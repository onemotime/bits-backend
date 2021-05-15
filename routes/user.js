const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/following', verifyToken, userController.fetchFollowingUser);
router.get('/all', verifyToken, userController.fetchUser);

router.post('/login', userController.login);
router.post('/signup', userController.signup);

router.patch('/follow', verifyToken, userController.followUser);
router.patch('/image', verifyToken, userController.postImageUrl);

module.exports = router;
