const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const verifyToken = require('../middleware/verifyToken');
const { ROUTES } = require('../constans');

router.post(`${ROUTES.LOGIN}`, authController.login);
router.post(`${ROUTES.LOGOUT}`, verifyToken, authController.logout);

module.exports = router;
