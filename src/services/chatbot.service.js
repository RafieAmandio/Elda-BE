const OpenAI = require('openai');
const redis = require('../config/redis');
const supabase = require('../config/supabase');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class ChatbotService {
  static async processMessage(userid, message) {
    try {

      const userData = await this.getUserData(userid);

      const chatHistory = await this.getChatHistory(userid);
   
      const response = await this.getGPTResponse(userData, chatHistory, message);
      

      await this.saveToHistory(userid, [
        { sender: 'user', message },
        { sender: 'elda', message: response }
      ]);

      return response;
    } catch (error) {
      console.error('Chatbot processing error:', error);
      throw error;
    }
  }

  static async getUserData(userid) {
    console.log(userid)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userid)
      .single();
    
    if (error) throw error;


    const { data: memos } = await supabase
      .from('memos')
      .select('*')
      .eq('userid', userid)
      .order('created_at', { ascending: false });


    const { data: schedules } = await supabase
      .from('schedules')
      .select('*')
      .eq('userid', userid);


    const { data: reminders } = await supabase
      .from('reminders')
      .select('*')
      .eq('userid', userid);

    return {
      user,
      memos: memos || [],
      schedules: schedules || [],
      reminders: reminders || []
    };
  }

  static async getChatHistory(userid) {
    const history = await redis.get(`chat:${userid}`);
    return history || [];
  }

  static async saveToHistory(userid, newMessages) {
    const history = await this.getChatHistory(userid);
    const updatedHistory = [...history, ...newMessages];
    await redis.set(`chat:${userid}`, updatedHistory);
  }

  static async getGPTResponse(userData, chatHistory, newMessage) {
    const contextPrompt = this.createContextPrompt(userData);
    const conversationHistory = chatHistory.map(msg => 
      `${msg.sender}: ${msg.message}`
    ).join('\n');

    const messages = [
      {
        role: "system",
        content: `You are Elda, a caring and attentive AI companion designed to help elderly users.
          You have access to the following information about the user:
          ${contextPrompt}
          
          Guidelines:
          1. Be patient, clear, and compassionate in your responses
          2. Reference the user's personal information when relevant
          3. Keep track of their medications and schedules
          4. Show concern for their well-being
          5. Use simple, easy-to-understand language
          6. If the user mentions any health concerns, remind them to consult healthcare professionals
          
          Previous conversation:
          ${conversationHistory}`
      },
      {
        role: "user",
        content: newMessage
      }
    ];
    console.log(messages)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  }

  static createContextPrompt(userData) {
    const { user, memos, schedules, reminders } = userData;
    
    return `
      User Profile:
      - Age: ${user.age}
      - Gender: ${user.gender}
      - Location: ${user.location}
      - Medical Information: ${JSON.stringify(user.medication)}
      - Emergency Contact: ${JSON.stringify(user.emergency)}
      - Habits: ${JSON.stringify(user.habits)}
      - Important Notes: ${user.important_notes}

      Recent Memos:
      ${memos.slice(0, 5).map(memo => `- ${memo.text}`).join('\n')}

      Active Schedules:
      ${schedules.map(schedule => 
        `- Time: ${schedule.time}, Days: ${schedule.repeating_day.join(', ')}`
      ).join('\n')}

      Active Reminders:
      ${reminders.map(reminder => 
        `- ${reminder.title} at ${reminder.reminder_time}`
      ).join('\n')}
    `;
  }
}

module.exports = { ChatbotService };