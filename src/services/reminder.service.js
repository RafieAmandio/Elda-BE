const supabase = require('../config/supabase');

class ReminderService {
  static async createReminder(reminderData) {
    try {
      console.log(reminderData)
      const { data, error } = await supabase
        .from('reminders')
        .insert([{
          userid: reminderData.userid,
          title: reminderData.title,
          reminder_time: reminderData.reminder_time
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create reminder error:', error);
      throw error;
    }
  }

  static async getRemindersByUserId(userid) {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('userid', userid)
        .order('reminder_time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get reminders by user id error:', error);
      throw error;
    }
  }

  static async getReminderById(id) {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get reminder error:', error);
      throw error;
    }
  }

  static async updateReminder(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .update({
          title: updateData.title,
          reminder_time: updateData.reminder_time
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update reminder error:', error);
      throw error;
    }
  }

  static async deleteReminder(id) {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete reminder error:', error);
      throw error;
    }
  }
}

module.exports = { ReminderService };