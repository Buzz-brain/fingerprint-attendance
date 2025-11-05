const express = require('express');
const router = express.Router();
const { login, register } = require('../../controllers/authController');

// POST /api/login
router.post('/login', login);

// POST /api/signup (lecturer registration)
router.post('/signup', register);

module.exports = router;
