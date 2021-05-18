const express = require('express');
const { ROUTES } = require('../constans');
const router = express.Router();
const userController = require('../controller/user.controller');
const verifyToken = require('../middleware/verifyToken');

router.get(`${ROUTES.ALL}`, verifyToken, userController.fetchUser);
router.get(`${ROUTES.FOLLOWING}`, verifyToken, userController.fetchFollowingUser);
router.get(`${ROUTES.PUSH_TOKENS}`, verifyToken, userController.fetchTokens)

router.post(`${ROUTES.LOGIN}`, userController.login);
router.post('/signup', userController.signup);

router.patch('/follow', verifyToken, userController.followUser);
router.patch('/image', verifyToken, userController.postImageUrl);

module.exports = router;
