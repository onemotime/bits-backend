const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken ,userController.getUserInfo);
router.post('/habit', verifyToken, userController.postHabit);

module.exports = router;
