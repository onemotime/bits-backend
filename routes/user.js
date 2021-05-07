const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken ,userController.getUserInfo);

module.exports = router;
