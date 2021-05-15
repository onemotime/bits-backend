const express = require('express');
const router = express.Router();
const habitController = require('../controller/habit.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, habitController.postHabit);

router.patch('/', verifyToken, habitController.patchHabit);
router.patch('/like', verifyToken, habitController.patchHabitLike);

router.delete('/', verifyToken, habitController.deleteHabit);

module.exports = router;
