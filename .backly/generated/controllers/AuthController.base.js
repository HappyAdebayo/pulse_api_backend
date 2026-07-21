'use strict';

const AuthService = require('../../../services/AuthService');
const validateRequest = require('../../../requests/AuthRequest');

/**
 * AuthController.base.js
 * Generated Base controller calling the business service.
 */

class AuthControllerBase {
  async refresh(req, res) {
    try {
      const body = { refresh_token: req.body.refresh_token };
      const input = { body };

      const result = await AuthService.refresh(input);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[AuthController:refresh]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async sign_up(req, res) {
    try {
      const body = { name: req.body.name, email: req.body.email, password: req.body.password };
      const input = { body };

      const result = await AuthService.sign_up(input);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[AuthController:sign_up]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async login(req, res) {
    try {
      const body = { email: req.body.email, password: req.body.password };
      const input = { body };

      const result = await AuthService.login(input);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[AuthController:login]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

  async logout(req, res) {
    try {
      const body = { refresh_token: req.body.refresh_token };
      const input = { body };

      const result = await AuthService.logout(input);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error('[AuthController:logout]', error);
      const status = error.statusCode || error.status || 500;
      return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
    }
  }

}

module.exports = AuthControllerBase;
