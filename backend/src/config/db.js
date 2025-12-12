const sqlite3 = require('sqlite3').verbose();
const path = require('path');
 
// Chemin vers la base
const dbPath = path.join(__dirname, '../../database.db');
 
// Connexion
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('SQLite error:', err.message);
  else console.log('Connected to SQLite database.');
});
 
// Tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);
 
db.run(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
  )
`);
 
module.exports = db;