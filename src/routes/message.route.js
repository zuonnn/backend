const express = require('express');
const { sendMessage, getMessages } = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:id', authMiddleware, getMessages);
router.post('/send/:id', authMiddleware, sendMessage);

module.exports = router;
