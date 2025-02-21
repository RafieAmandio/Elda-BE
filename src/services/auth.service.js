const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { OpenAIService } = require('./openai.service');

class AuthService {
  static async register(rawUserData) {
    try {
      // Parse the raw text using OpenAI
      const parsedData = await OpenAIService.parseUserData(rawUserData);
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(parsedData.password, 10);

      // Prepare user data for Supabase
      const userData = {
        email: parsedData.email,
        password: hashedPassword,
        age: parsedData.age,
        gender: parsedData.gender,
        location: parsedData.location,
        medication: parsedData.medication,
        emergency: parsedData.emergency,
        habits: parsedData.habits,
        important_notes: parsedData.important_notes
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select('email, age, gender, location')
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
      // Get user from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      if (!user) throw new Error('User not found');

      // Compare passwords
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error('Invalid password');

      // Return user data (excluding password)
      const { password: _, ...userData } = user;
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}

module.exports = { AuthService };