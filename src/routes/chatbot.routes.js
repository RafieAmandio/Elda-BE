const express = require('express');
const router = express.Router();
const { ChatbotController } = require('../controllers/chatbot.controller');

router.post('/chat', ChatbotController.chat);
router.get('/history/:userid', ChatbotController.getChatHistory);


module.exports = router;