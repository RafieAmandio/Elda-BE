// src/services/schedule.service.js
const supabase = require('../config/supabase');

class ScheduleService {
  static async createSchedule(scheduleData) {
    try {
      
      const formattedTime = formatTimeString(scheduleData.time);
      
      const { data, error } = await supabase
        .from('schedules') 
        .insert([{
          userid: scheduleData.userid,
          time: formattedTime,
          repeating_day: scheduleData.repeating_day,
          starting_date: scheduleData.starting_date
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create schedule error:', error);
      throw error;
    }
  }

  static async getSchedulesByUserId(userid) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('userid', userid)
        .order('time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get schedules error:', error);
      throw error;
    }
  }

  static async getScheduleById(id) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get schedule error:', error);
      throw error;
    }
  }

  static async updateSchedule(id, updateData) {
    try {
      
      const formattedTime = updateData.time ? formatTimeString(updateData.time) : undefined;
      
      const updatePayload = {
        ...(formattedTime && { time: formattedTime }),
        ...(updateData.repeating_day && { repeating_day: updateData.repeating_day }),
        ...(updateData.starting_date && { starting_date: updateData.starting_date })
      };

      const { data, error } = await supabase
        .from('schedules')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update schedule error:', error);
      throw error;
    }
  }

  static async deleteSchedule(id) {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete schedule error:', error);
      throw error;
    }
  }
}

function formatTimeString(time) {
  if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time)) {
    return time;
  }
  

  if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return `${time}:00`;
  }

  throw new Error('Invalid time format. Please use HH:mm or HH:mm:ss');
}

module.exports = { ScheduleService };