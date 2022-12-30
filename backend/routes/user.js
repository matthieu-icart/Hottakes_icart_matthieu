// Import Express
const express = require('express');

// Import User Controller
const userCtrl = require('../controllers/user');

// Create Router
const router = express.Router();

/* ROUTER */

// Signup 
router.post('/signup', userCtrl.signup);

// Login 
router.post('/login', userCtrl.login);

// Export Router
module.exports = router;