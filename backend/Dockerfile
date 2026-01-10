# Basis-Image: Node.js 20
FROM node:20-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm install

# Alle Backend-Dateien kopieren
COPY . .

# Port freigeben
EXPOSE 5000

# Server starten
CMD ["npm", "start"]