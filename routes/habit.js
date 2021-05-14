const express = require('express');
const router = express.Router();
const habitController = require('../controller/habit.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, habitController.postHabit);
router.patch('/', verifyToken, habitController.patchHabit);
router.delete('/', verifyToken, habitController.deleteHabit);

module.exports = router;
