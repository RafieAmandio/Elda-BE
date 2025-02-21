const express = require('express');
const router = express.Router();
const { ReminderController } = require('../controllers/reminder.controller');

router.post('/', ReminderController.createReminder);
router.get('/user/:userid', ReminderController.getRemindersByUserId); 
router.get('/:id', ReminderController.getReminderById);
router.put('/:id', ReminderController.updateReminder);
router.delete('/:id', ReminderController.deleteReminder);

module.exports = router;