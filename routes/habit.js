const express = require('express');
const router = express.Router();
const habitController = require('../controller/habit.controller');

router.post('/', habitController.postHabit);
router.delete('/', habitController.deleteHabit);
router.patch('/', habitController.patchHabit);

module.exports = router;
