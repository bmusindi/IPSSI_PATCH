# Image Node légère
FROM node:20-alpine
 
# Dossier de travail dans le conteneur
WORKDIR /usr/src/app
 
# Copier les fichiers de dépendances
COPY package*.json ./
 
# Installer seulement les deps nécessaires en prod
RUN npm install --omit=dev
 
# Copier le code source
COPY src ./src
 
# Copier la base SQLite (structure + données locales)
COPY database.db ./database.db
 
# Variable d'environnement
ENV NODE_ENV=production
 
# Exposer le port backend
EXPOSE 8000
 
# Commande de démarrage
CMD ["node", "src/server.js"]