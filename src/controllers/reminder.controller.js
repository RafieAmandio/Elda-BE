const { ReminderService } = require('../services/reminder.service');

class ReminderController {
  static async createReminder(req, res, next) {
    try {

      const { userid, title, reminder_time } = req.body;
      

      if (!userid || !title || !reminder_time) {
        return res.status(400).json({ 
          message: 'User ID, title, and reminder time are required' 
        });
      }


      if (!isValidTimestamp(reminder_time)) {
        return res.status(400).json({ 
          message: 'Invalid reminder time format. Use ISO 8601 format (e.g., 2024-02-22T15:30:00Z)' 
        });
      }

      const reminder = await ReminderService.createReminder({
        userid,
        title,
        reminder_time
      });

      res.status(201).json(reminder);
    } catch (error) {
      next(error);
    }
  }

  static async getRemindersByUserId(req, res, next) {
    try {
      const { userid } = req.params;
      
      if (!userid) {
        return res.status(400).json({ 
          message: 'User ID is required' 
        });
      }

      const reminders = await ReminderService.getRemindersByUserId(userid);
      res.json(reminders);
    } catch (error) {
      next(error);
    }
  }

  static async getReminderById(req, res, next) {
    try {
      const reminder = await ReminderService.getReminderById(req.params.id);

      if (!reminder) {
        return res.status(404).json({ message: 'Reminder not found' });
      }

      res.json(reminder);
    } catch (error) {
      next(error);
    }
  }

  static async updateReminder(req, res, next) {
    try {
      const { title, reminder_time } = req.body;


      if (!title || !reminder_time) {
        return res.status(400).json({ 
          message: 'Title and reminder time are required' 
        });
      }

      if (!isValidTimestamp(reminder_time)) {
        return res.status(400).json({ 
          message: 'Invalid reminder time format. Use ISO 8601 format (e.g., 2024-02-22T15:30:00Z)' 
        });
      }

      const reminder = await ReminderService.updateReminder(
        req.params.id,
        { title, reminder_time }
      );

      if (!reminder) {
        return res.status(404).json({ message: 'Reminder not found' });
      }

      res.json(reminder);
    } catch (error) {
      next(error);
    }
  }

  static async deleteReminder(req, res, next) {
    try {
      const success = await ReminderService.deleteReminder(req.params.id);

      if (!success) {
        return res.status(404).json({ message: 'Reminder not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}


function isValidTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date instanceof Date && !isNaN(date);
}

module.exports = { ReminderController };