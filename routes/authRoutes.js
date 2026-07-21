const express = require('express');
const router = express.Router();
// Debug: Active Endpoints for AuthController: refresh, sign_up, login, logout
const AuthRequest = require('../requests/AuthRequest');
const AuthController = require('../controllers/AuthController');

router.post('/refresh', AuthRequest.refresh, AuthController.refresh);
router.post('/', AuthRequest.sign_up, AuthController.sign_up);
router.post('/', AuthRequest.login, AuthController.login);
router.post('/logout', AuthRequest.logout, AuthController.logout);

module.exports = router;
