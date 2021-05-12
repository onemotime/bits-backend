const express = require('express');
const router = express.Router();
const habitController = require('../controller/habit.controller');

router.post('/', habitController.postHabit);
router.patch('/', habitController.patchHabit);
router.delete('/', habitController.deleteHabit);

module.exports = router;
