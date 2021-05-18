const express = require('express');
const router = express.Router();
const habitController = require('../controller/habit.controller');
const verifyToken = require('../middleware/verifyToken');
const { ROUTES } = require('../constans');

router.post(`${ROUTES.HOME}`, verifyToken, habitController.postHabit);

router.patch(`${ROUTES.HOME}`, verifyToken, habitController.patchHabit);
router.patch(`${ROUTES.LIKE}`, verifyToken, habitController.patchHabitLike);

router.delete(`${ROUTES.HOME}`, verifyToken, habitController.deleteHabit);

module.exports = router;
