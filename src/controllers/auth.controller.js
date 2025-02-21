const { AuthService } = require('../services/auth.service');

class AuthController {
  static async register(req, res, next) {
    try {
      const { rawUserData } = req.body;
      if (!rawUserData) {
        return res.status(400).json({ message: 'Raw user data is required' });
      }

      const user = await AuthService.register(rawUserData);
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