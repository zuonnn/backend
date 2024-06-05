const express = require('express');
const { getUsersForSidebar } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, getUsersForSidebar);

module.exports = router;
