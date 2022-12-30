// Import Express
const express = require('express');

// Import Multer
const multer = require('../middleware/multer-config');

// Import Authentification Middleware
const auth = require('../middleware/auth');

// Import Sauce Controller
const sauceCtrl = require('../controllers/sauce');

// Create Router
const router = express.Router();

/* ROUTER */

// Get All Sauce 
router.get('/', auth, sauceCtrl.getAllSauce);

// Get Single Sauce 
router.get('/:id', auth, sauceCtrl.getSingleSauce);

// Create Sauce 
router.post('/', auth, multer, sauceCtrl.createSauce);

// Update Sauce 
router.put('/:id', auth, multer, sauceCtrl.updateSauce);

// Delete Sauce 
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);

// Like & Dislike
router.post('/:id/like', auth, sauceCtrl.likeSauce);

// Export Router
module.exports = router;