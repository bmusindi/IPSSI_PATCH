const db = require("../config/db");
 
function insertUser(name, passwordHash) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (name, password) VALUES (?, ?)`,
      [name, passwordHash],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}
 
function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, name FROM users`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
 
function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id, name FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}
 
module.exports = {
  insertUser,
  getAllUsers,
  getUserById
};