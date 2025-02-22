const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const reminderRoutes = require('./reminder.routes');
const scheduleRoutes = require('./schedule.routes');
const memoRoutes = require('./memo.routes');
const chatbotRoutes = require('./chatbot.routes')

router.use('/auth', authRoutes);
router.use('/reminder',reminderRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/memos',memoRoutes);
router.use('/chatbot',chatbotRoutes);


module.exports = router;