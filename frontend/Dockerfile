# Basis-Image: Node.js 20
FROM node:20-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm install

# Alle Frontend-Dateien kopieren
COPY . .

# Port freigeben
EXPOSE 5173

# Vite Dev-Server starten
CMD ["npm", "run", "dev", "--", "--host"]