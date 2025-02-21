const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
  static async parseUserData(rawText) {
    const prompt = `
      Parse the following text into a structured user data format. The text contains information about a user including their age, gender, location, medications, emergency contacts, habits, and important notes.
      
      Here's the required format:
      - age: number
      - gender: string
      - location: string
      - medication: array of objects with { medicineName: string, schedule: string }
      - emergency: object with { name: string, mobileNo: string }
      - habits: array of strings
      - important_notes: string

      Raw text: ${rawText}

      Please provide the response in valid JSON format. without any code block.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that parses unstructured text into structured data. Always return valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI parsing error:', error);
      throw new Error('Failed to parse user data');
    }
  }
}

module.exports = { OpenAIService };