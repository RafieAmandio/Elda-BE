const { AuthService } = require('../services/auth.service');

class AuthController {
  static async register(req, res, next) {
    try {

      const requiredFields = ['email', 'password', 'age', 'gender', 
                            'latitude', 'longitude', 'medication', 
                            'emergency', 'habits', 'important_notes','name'];
      
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      }

      // Validate latitude and longitude are valid numbers
      const latitude = parseFloat(req.body.latitude);
      const longitude = parseFloat(req.body.longitude);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: 'Invalid latitude or longitude format' });
      }

      if (latitude < -90 || latitude > 90) {
        return res.status(400).json({ message: 'Latitude must be between -90 and 90' });
      }

      if (longitude < -180 || longitude > 180) {
        return res.status(400).json({ message: 'Longitude must be between -180 and 180' });
      }

      const user = await AuthService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await AuthService.login(email, password);
      res.json({
        message: 'Login successful',
        user
      });
    } catch (error) {
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      next(error);
    }
  }
}

module.exports = { AuthController };