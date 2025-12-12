// src/app.js - CORRIGÉ
const express = require("express");
const security = require("./middlewares/security");
const routes = require("./routes");

const app = express();

// Utilisez d'abord les middlewares de sécurité
security(app);  // Cette ligne DOIT être après la déclaration de 'security'

// Ensuite le middleware pour parser le JSON
app.use(express.json());

// Enfin les routes
app.use("/", routes);

module.exports = app;