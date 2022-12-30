// Import Ddos, Express, Mongoose, Path, Helmet & Dotenv
const Ddos = require('ddos');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

// Config Ddos
const ddos = new Ddos({burst:10, limit:15});

// Import Router
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Connect To MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.SECRET_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Create Application & Ddos Security
const app = express();
app.use(ddos.express);

// CORS Authorization
app.use(helmet());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

// Get JSON On Request
app.use(express.json());

/* MIDDLEWARE */

// User Routes
app.use('/api/auth', userRoutes);

// Sauce Routes
app.use('/api/sauces', sauceRoutes);

// Image Routes
app.use('/images', express.static(path.join(__dirname, 'images')))

// App Export For Server
module.exports = app;