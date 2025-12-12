// src/middlewares/security.js
const helmet = require('helmet');
const cors = require('cors');

module.exports = function security(app) {
  // Configuration CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }));
  
  // Helmet pour la sécurité HTTP
  app.use(helmet());
  
  // Autres middlewares de sécurité...
  app.use((req, res, next) => {
    // Désactiver X-Powered-By
    res.removeHeader('X-Powered-By');
    // HSTS, etc.
    next();
  });
};