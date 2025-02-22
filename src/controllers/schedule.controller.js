const { ScheduleService } = require('../services/schedule.service');
const { ReminderService} = require('../services/reminder.service');

class ScheduleController {
  static async createSchedule(req, res, next) {
    try {
      const { userid, title, time, repeating_day, starting_date } = req.body;

      if (!userid || !title || !time || !repeating_day || !starting_date) {
        return res.status(400).json({
          message: 'User ID, title, time, repeating days, and starting date are required'
        });
      }

      if (!Array.isArray(repeating_day)) {
        return res.status(400).json({
          message: 'Repeating days must be an array'
        });
      }

      if (!isValidDate(starting_date)) {
        return res.status(400).json({
          message: 'Invalid date format. Please use YYYY-MM-DD'
        });
      }

      const schedule = await ScheduleService.createSchedule({
        userid,
        title,
        time,
        repeating_day,
        starting_date
      });

      res.status(201).json(schedule);
    } catch (error) {
      if (error.message.includes('Invalid time format')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  static async getSchedulesByUserId(req, res, next) {
    try {
      const { userid } = req.params;

      if (!userid) {
        return res.status(400).json({
          message: 'User ID is required'
        });
      }

      const schedules = await ScheduleService.getSchedulesByUserId(userid);
      const reminders = await ReminderService.getRemindersByUserId(userid);
      res.json({schedules, reminders});
    } catch (error) {
      next(error);
    }
  }

  static async getScheduleById(req, res, next) {
    try {
      const schedule = await ScheduleService.getScheduleById(req.params.id);

      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }

  static async updateSchedule(req, res, next) {
    try {
      const { title, time, repeating_day, starting_date } = req.body;

      if (repeating_day && !Array.isArray(repeating_day)) {
        return res.status(400).json({
          message: 'Repeating days must be an array'
        });
      }

      if (starting_date && !isValidDate(starting_date)) {
        return res.status(400).json({
          message: 'Invalid date format. Please use YYYY-MM-DD'
        });
      }

      const schedule = await ScheduleService.updateSchedule(req.params.id, {
        title,
        time,
        repeating_day,
        starting_date
      });

      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      res.json(schedule);
    } catch (error) {
      if (error.message.includes('Invalid time format')) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  static async deleteSchedule(req, res, next) {
    try {
      const success = await ScheduleService.deleteSchedule(req.params.id);

      if (!success) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
}

module.exports = { ScheduleController };