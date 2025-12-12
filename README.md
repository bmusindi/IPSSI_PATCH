IPSSI PATCH MANAGEMENT - PROJET ÉTUDIANT
========================================

Étudiant: Benit Musindi
Date: 12 Décembre 2025

DESCRIPTION
-----------
Projet de gestion des utilisateurs et commentaires.
Application fullstack avec backend Express et frontend React.

INSTALLATION RAPIDE
-------------------
1. Ouvrir un terminal dans le dossier du projet
2. Lancer: docker-compose up
3. Ouvrir: http://localhost:3000

SANS DOCKER:
- Backend: cd backend && npm install && npm start (port 8000)
- Frontend: cd frontend && npm install && npm start (port 3000)

STRUCTURE
---------
/backend/    - API Node.js + Express + SQLite
/frontend/   - Application React

FONCTIONNALITÉS
---------------
 Liste des utilisateurs depuis la base SQLite
 Recherche d'utilisateur par ID
 Ajout de commentaires
 Affichage sécurisé des commentaires
 Protection XSS (échappement HTML)


POINTS TECHNIQUES
-----------------
• ORM Sequelize pour la base de données
• Architecture MVC dans le backend
• Sécurisation des entrées/sorties
• Communication frontend-backend avec Axios
• Conteneurisation Docker

POUR TESTER
-----------
1. Lancer l'application (voir INSTALLATION)
2. Sur http://localhost:3000 :
   - Voir la liste des utilisateurs
   - Rechercher un utilisateur (ex: ID 1)
   - Ajouter un commentaire
   - Vérifier que les balises dangereuses sont bloquées

BASE DE DONNÉES
---------------
Fichier: backend/database.db (SQLite)
Tables: users, comments
Peuplée avec des données de test.

CONTACT
-------
Benit Musindi
