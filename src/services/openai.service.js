const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
  static async parseUserData(data) {

    const textToAnalyze = {
      age: data.age,
      gender: data.gender,
      medication: data.medication,
      emergency: data.emergency,
      habits: data.habits,
      important_notes: data.important_notes
    };

    const prompt = `
      Please parse the following user information into a structured format. 
      Each section contains specific information that needs to be extracted and formatted.

      User Information to Parse:
      Age Text: "${textToAnalyze.age}"
      Gender Text: "${textToAnalyze.gender}"
      Medication Text: "${textToAnalyze.medication}"
      Emergency Contact Text: "${textToAnalyze.emergency}"
      Habits Text: "${textToAnalyze.habits}"
      Important Notes: "${textToAnalyze.important_notes}"

      Required format:
      {
        "age": <extract number only>,
        "gender": <convert to "male" or "female">,
        "medication": [
          {
            "medicineName": <name of medicine>,
            "schedule": <when to take>
          }
        ],
        "emergency": {
          "name": <contact person name>,
          "mobileNo": <contact number, remove any spaces or special characters>
        },
        "habits": [<array of individual habits as strings>],
        "important_notes": <clean text string>
      }

      Rules:
      1. Age must be a number
      2. Gender must be either "MALE" or "FEMALE"
      3. Medication must be an array of objects with medicineName and schedule, the schedule is a time format like 19.00
      4. Emergency contact should extract name and clean phone number
      5. Habits should be split into individual activities
      6. Return only the JSON object, no additional text

      Parse the above information and return a properly formatted JSON object following these rules.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a precise data extraction assistant. Your task is to parse unstructured text into structured JSON data. Only respond with valid JSON, no additional text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, 
        max_tokens: 1000,
        response_format: { type: "json_object" } 
      });
      console.log(completion.choices[0].message.content);
      const parsedData = JSON.parse(completion.choices[0].message.content);


      const validationResult = validateParsedData(parsedData);
      if (!validationResult.isValid) {
        throw new Error(`Invalid data structure: ${validationResult.error}`);
      }

      return parsedData;
    } catch (error) {
      console.error('OpenAI parsing error:', error);
      throw new Error('Failed to parse user data: ' + error.message);
    }
  }
}


function validateParsedData(data) {
  try {

    if (typeof data.age !== 'number') {
      return { isValid: false, error: 'Age must be a number' };
    }


    if (!['male', 'female'].includes(data.gender.toLowerCase())) {
      return { isValid: false, error: 'Gender must be "male" or "female"' };
    }

 
    if (!Array.isArray(data.medication)) {
      return { isValid: false, error: 'Medication must be an array' };
    }
    for (const med of data.medication) {
      if (!med.medicineName || !med.schedule) {
        return { isValid: false, error: 'Each medication must have medicineName and schedule' };
      }
    }


    if (!data.emergency || !data.emergency.name || !data.emergency.mobileNo) {
      return { isValid: false, error: 'Emergency contact must have name and mobileNo' };
    }

 
    if (!Array.isArray(data.habits)) {
      return { isValid: false, error: 'Habits must be an array' };
    }


    if (typeof data.important_notes !== 'string') {
      return { isValid: false, error: 'Important notes must be a string' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Data structure validation failed' };
  }
}

module.exports = { OpenAIService };