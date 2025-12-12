const db = require("../config/db");
 
function insertComment(content) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO comments (content) VALUES (?)`,
      [content],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}
 
function getComments() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM comments ORDER BY id DESC`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
 
module.exports = {
  insertComment,
  getComments
};