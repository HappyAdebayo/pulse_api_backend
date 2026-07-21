const express = require('express');
const router = express.Router();

const workspaceRoutes = require('./workspaceRoutes');
const authRoutes = require('./authRoutes');

router.use('/workspace', workspaceRoutes);
router.use('/auth', authRoutes);

module.exports = router;
