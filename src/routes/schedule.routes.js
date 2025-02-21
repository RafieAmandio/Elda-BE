const express = require('express');
const router = express.Router();
const { ScheduleController } = require('../controllers/schedule.controller');

router.post('/', ScheduleController.createSchedule);
router.get('/user/:userid', ScheduleController.getSchedulesByUserId);
router.get('/:id', ScheduleController.getScheduleById);
router.put('/:id', ScheduleController.updateSchedule);
router.delete('/:id', ScheduleController.deleteSchedule);

module.exports = router;
