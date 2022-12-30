// Import Bcrypt
const bcrypt = require('bcrypt');

// Import JsonWebToken 
const jsonWebToken = require('jsonwebtoken');

// Import User Model
const User = require('../models/user');

// Create User & Hash Password
exports.signup = (req, res, next) => {
    // Hash Password
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            // Create User
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            // Save To MongoDB
            user.save()
                .then(() => res.status(201).json({ message: 'Nouvel Utilisateur Créé' }))
                .catch(error => res.status(400).json({ error, message: 'Utilisateur ou Mot de passe non valide' }));
        })
        .catch(error => res.status(500).json({ error }));
};

// User, Hashed Password & Token Validation
exports.login = (req, res, next) => {
    // User Validation
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user || user === null) {
                return res.status(401).json({ message: 'Identifiant & mot de passe incorrecte.' });
            }
            // Hashed Password Validation
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Identifiant & mot de passe incorrecte.' });
                    }
                    // Response & Token With UserId
                    res.status(200).json({
                        userId: user._id,
                        token: jsonWebToken.sign(
                            { userId: user._id },
                            process.env.SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};