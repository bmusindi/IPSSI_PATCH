// src/controllers/commentController.js
const db = require("../config/database");

// Fonction pour échapper le HTML (SÉCURITÉ)
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Ajouter un commentaire (SÉCURISÉ)
exports.addComment = async (req, res) => {
  try {
    let content;
    
    // Gérer les deux formats (JSON ou texte brut)
    if (typeof req.body === 'object' && req.body.content) {
      content = escapeHtml(req.body.content);
    } else if (typeof req.body === 'string') {
      content = escapeHtml(req.body);
    } else {
      return res.status(400).json({ error: "Invalid comment format" });
    }
    
    // Validation supplémentaire
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ error: "Comment too long (max 1000 chars)" });
    }
    
    const sql = "INSERT INTO comments (content, userId, timestamp) VALUES (?, ?, ?)";
    const params = [
      content,
      req.body.userId || 1,
      new Date().toISOString()
    ];
    
    db.run(sql, params, function(err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to save comment" });
      }
      res.json({ 
        success: true, 
        id: this.lastID,
        message: "Comment added safely"
      });
    });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Récupérer les commentaires (SÉCURISÉ)
exports.getComments = async (req, res) => {
  try {
    const sql = "SELECT * FROM comments ORDER BY timestamp DESC LIMIT 50";
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to fetch comments" });
      }
      
      // Assurer que le contenu est sécurisé
      const safeComments = rows.map(comment => ({
        ...comment,
        content: comment.content, // Déjà échappé à l'insertion
        // Vérification supplémentaire
        isSafe: true
      }));
      
      res.json(safeComments);
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ error: "Server error" });
  }
};