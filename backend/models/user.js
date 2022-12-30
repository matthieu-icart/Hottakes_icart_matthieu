// Import Mongoose 
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// New User Mongoose Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Only One User Per Mail Verification  
userSchema.plugin(uniqueValidator);

// Export User Model
module.exports = mongoose.model('User', userSchema);