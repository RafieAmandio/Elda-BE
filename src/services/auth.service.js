// src/services/auth.service.js
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { OpenAIService } = require('./openai.service');

class AuthService {
  static async register(userData) {
    try {
      console.log(userData);
      const { email, password, longitude, latitude } = userData;


      const hashedPassword = await bcrypt.hash(password, 10);


      const parsedData = await OpenAIService.parseUserData(userData);
      console.log("prse")
      console.log(parsedData)

      const supabaseData = {
        email,
        password: hashedPassword,
        latitude: parseFloat(latitude), 
        longitude: parseFloat(longitude), 
        age: parsedData.age,
        gender: parsedData.gender,
        medication: parsedData.medication,
        emergency: parsedData.emergency,
        habits: parsedData.habits,
        important_notes: parsedData.important_notes,
        name: parsedData.Name
      };

      const { data, error } = await supabase
        .from('users')
        .insert([supabaseData])
        .select('email, age, gender, latitude, longitude, medication, emergency, habits, important_notes, name')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      if (!user) throw new Error('User not found');

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error('Invalid password');

      const { password: _, ...userData } = user;
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}

module.exports = { AuthService };