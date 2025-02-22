const { ChatbotService } = require('../services/chatbot.service');

class ChatbotController {
  static async chat(req, res, next) {
    try {
      console.log("Masok")
      const { userid, message } = req.body;

      if (!userid || !message) {
        return res.status(400).json({
          message: 'User ID and message are required'
        });
      }

      const response = await ChatbotService.processMessage(userid, message);

      res.json({
        message: response
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { ChatbotController };