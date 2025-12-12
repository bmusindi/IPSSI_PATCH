// src/App.js - VERSION COMPLÈTEMENT CORRIGÉE
import React, { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

// Fonction utilitaire pour échapper le HTML (sécurité XSS)
const escapeHtml = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

function App() {
  // États pour les utilisateurs
  const [users, setUsers] = useState([]);
  const [queryId, setQueryId] = useState("");
  const [queriedUser, setQueriedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

  // États pour les commentaires
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  // États généraux
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chargement initial
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await Promise.all([loadUsers(), loadComments()]);
      } catch (err) {
        setError("Failed to initialize application");
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data || []);
      setUserError("");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to load users";
      setUserError(message);
      console.error("Load users error:", err);
    }
  };

  // Charger les commentaires
  const loadComments = async () => {
    try {
      const response = await api.get("/comments");
      
      // Sécuriser les commentaires côté client
      const safeComments = (response.data || []).map(comment => ({
        ...comment,
        content: escapeHtml(comment.content || "")
      }));
      
      setComments(safeComments);
      setCommentError("");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to load comments";
      setCommentError(message);
      console.error("Load comments error:", err);
    }
  };

  // Rechercher un utilisateur par ID
  const handleQueryUser = async (e) => {
    e.preventDefault();
    
    if (!queryId.trim()) {
      setUserError("Please enter a user ID");
      return;
    }
    
    const id = parseInt(queryId);
    if (isNaN(id) || id <= 0) {
      setUserError("Please enter a valid positive number");
      return;
    }

    setUserLoading(true);
    setUserError("");
    setQueriedUser(null);

    try {
      let response;
      try {
        response = await api.post("/user", { id: id });
      } catch (jsonErr) {
        response = await api.post(
          "/user",
          id.toString(),
          { headers: { "Content-Type": "text/plain" } }
        );
      }

      const data = response.data;
      
      if (!data) {
        setUserError("No data returned from server");
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        setQueriedUser(data[0]);
      } else if (data.id) {
        setQueriedUser(data);
      } else {
        setUserError("User not found");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Error querying user";
      setUserError(message);
      console.error("Query user error:", err);
    } finally {
      setUserLoading(false);
    }
  };

  // Ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setCommentError("Please enter a comment");
      return;
    }

    if (newComment.length > 1000) {
      setCommentError("Comment too long (max 1000 characters)");
      return;
    }

    setCommentLoading(true);
    setCommentError("");

    try {
      let response;
      try {
        response = await api.post("/comment", {
          content: newComment,
          userId: 1,
          timestamp: new Date().toISOString()
        });
      } catch (jsonErr) {
        response = await api.post(
          "/comment",
          newComment,
          { headers: { "Content-Type": "text/plain" } }
        );
      }

      if (response.status >= 200 && response.status < 300) {
        setNewComment("");
        await loadComments();
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Error posting comment";
      setCommentError(message);
      console.error("Add comment error:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>IPSSI Patch Management</h1>
        <p className="subtitle">User and Comment Management System</p>

        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* SECTION UTILISATEURS */}
        <section className="card">
          <div className="card-header">
            <h2>👥 User Management</h2>
            <button 
              onClick={loadUsers} 
              className="refresh-btn"
              title="Refresh users list"
            >
              ↻
            </button>
          </div>

          <div className="users-section">
            <h3>Available Users ({users.length})</h3>
            {userError && <div className="error-message">{userError}</div>}
            
            <div className="users-grid">
              {users.length === 0 ? (
                <div className="empty-state">No users found in database</div>
              ) : (
                users.slice(0, 20).map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-id">#{user.id}</div>
                    <div className="user-name">{user.name || "Unnamed User"}</div>
                    {user.email && <div className="user-email">{user.email}</div>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="query-section">
            <h3>🔍 Search User by ID</h3>
            <form onSubmit={handleQueryUser} className="query-form">
              <div className="form-group">
                <input
                  type="number"
                  min="1"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  placeholder="Enter user ID (e.g., 1, 2, 3...)"
                  disabled={userLoading}
                />
                <button 
                  type="submit" 
                  disabled={userLoading || !queryId.trim()}
                  className="query-btn"
                >
                  {userLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {queriedUser && (
              <div className="query-result">
                <h4>✅ User Found</h4>
                <div className="user-details">
                  <div><strong>ID:</strong> {queriedUser.id}</div>
                  <div><strong>Name:</strong> {queriedUser.name || "N/A"}</div>
                  <div><strong>Email:</strong> {queriedUser.email || "N/A"}</div>
                  <div><strong>Company:</strong> {queriedUser.company || "N/A"}</div>
                  <div><strong>City:</strong> {queriedUser.city || "N/A"}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION COMMENTAIRES */}
        <section className="card">
          <div className="card-header">
            <h2>💬 Comments Section</h2>
            <button 
              onClick={loadComments} 
              className="refresh-btn"
              title="Refresh comments"
            >
              ↻
            </button>
          </div>

          <div className="comment-form-section">
            <h3>Add New Comment</h3>
            {commentError && <div className="error-message">{commentError}</div>}
            
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here..."
                rows="4"
                maxLength="1000"
                disabled={commentLoading}
              />
              <div className="form-actions">
                <div className="char-count">
                  {newComment.length}/1000 characters
                </div>
                <button 
                  type="submit" 
                  disabled={commentLoading || !newComment.trim()}
                  className="submit-btn"
                >
                  {commentLoading ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          </div>

          <div className="comments-section">
            <h3>Recent Comments ({comments.length})</h3>
            
            {comments.length === 0 ? (
              <div className="empty-state">No comments yet. Be the first to post!</div>
            ) : (
              <div className="comments-list">
                {comments.map((comment, index) => (
                  <div key={comment.id || index} className="comment-card">
                    <div className="comment-content">
                      {comment.content}
                    </div>
                    <div className="comment-meta">
                      <span className="comment-user">
                        👤 User #{comment.userId || "Anonymous"}
                      </span>
                      <span className="comment-time">
                        🕒 {comment.timestamp 
                          ? new Date(comment.timestamp).toLocaleString() 
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STATISTIQUES */}
        <section className="card stats-card">
          <h2>📊 System Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{users.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Comments</div>
              <div className="stat-value">{comments.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">API Status</div>
              <div className="stat-value status-ok">Online</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Last Updated</div>
              <div className="stat-value">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </section>

        <footer className="app-footer">
          <p>IPSSI Patch Management System v1.0</p>
          <p className="footer-note">
            Backend running on port 8000 | Connected to SQLite database
          </p>
        </footer>
      </header>
    </div>
  );
}

// EXPORT PAR DÉFAUT CORRECT
export default App;