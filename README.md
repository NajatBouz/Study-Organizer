# Study Organizer

Eine Full-Stack Webanwendung zur Organisation des Kurses - entwickelt als Abschlussprojekt 2026.



## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architektur](#architektur)
- [Installation & Setup](#installation--setup)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Verwendung](#verwendung)
- [API Dokumentation](#api-dokumentation)
- [Projektstruktur](#projektstruktur)
- [Entwicklung](#entwicklung)
- [Lessons Learned](#lessons-learned)

## Überblick

Study Organizer ist eine zentrale Plattform für Kursteilnehmer/in, um ihren Kursalltag effizient zu organisieren. Die Anwendung bietet eine intuitive Benutzeroberfläche zur Verwaltung von Kontakten, Terminen, Links und Dateien - alles an einem Ort.


## Features

### Core Features
- **Authentifizierung**
  - Benutzerregistrierung und Login
  - JWT-basierte Session-Verwaltung
  - Passwort-Reset via Email (AWS SES)
  
- **Kontakte**
  - Lerngruppen und Kommilitonen verwalten
  - Kontaktinformationen speichern
  - Schnelle Suche und Filter

- **Events & Termine**
  - Prüfungstermine und Deadlines tracken
  - Kalenderansicht
  - Kategorisierung nach Typ

- **Links & Ressourcen**
  - Wichtige Webseiten gebündelt
  - Kategorisierung
  - Schnellzugriff

- **Datei-Management**
  - Dokumente hochladen und organisieren
  - Ordnerstruktur
  - Datei-Download

### Sicherheit
- Passwort-Hashing mit bcrypt
- JWT Token-basierte Authentifizierung
- Sichere Password-Reset Tokens (SHA256)
- Email-Verifizierung via AWS SES

##  Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build Tool & Dev Server
- **Axios** - HTTP Client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **MongoDB Atlas** - Cloud Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password Hashing
- **AWS SDK v2** - AWS Services Integration

### DevOps & Infrastructure
- **Docker & Docker Compose** - Containerization
- **AWS EC2** - Server Hosting (t3.micro)
- **AWS SES** - Email Service
- **AWS CloudFormation** - Infrastructure as Code
- **GitHub Actions** - CI/CD Pipeline

### Development Tools
- **Git & GitHub** - Version Control
- **npm** - Package Management
- **Ubuntu 24.04** - Server OS

##  Architektur

```
┌─────────────────┐
│   Frontend      │
│   React + Vite  │
│   Port: 5173    │
└────────┬────────┘
         │ HTTP/REST API
         ↓
┌─────────────────┐
│   Backend       │
│   Node.js       │
│   Express       │
│   Port: 5000    │
└────────┬────────┘
         │ Mongoose
         ↓
┌─────────────────┐
│   Database      │
│  MongoDB Atlas  │
│   (Cloud)       │
└─────────────────┘

AWS Services:
- EC2: Application Hosting
- SES: Email Service (kommuniziert mit Backend)
- CloudFormation: Infrastructure
```

##  Installation & Setup

### Voraussetzungen
- Node.js 18+ und npm
- MongoDB Atlas Account (oder lokale MongoDB)
- AWS Account (für SES und Deployment)
- Git

### Lokale Entwicklung

1. **Repository klonen:**
```bash
git clone https://github.com/NajatBouz/Study-Organizer.git
cd Study-Organizer
```

2. **Backend Setup:**
```bash
cd backend
npm install

# .env Datei erstellen
cat > .env << EOF
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
PORT=5000
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
SES_FROM_EMAIL=your-verified-email@example.com
AWS_REGION=eu-central-1
FRONTEND_URL=http://localhost:5173
EOF

npm start
```

3. **Frontend Setup:**
```bash
cd frontend
npm install

# .env Datei erstellen
echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
```

4. **App öffnen:** http://localhost:5173

### Mit Docker

```bash
# docker-compose.yml verwenden
docker compose up -d

# Logs ansehen
docker compose logs -f

# Stoppen
docker compose down
```

##  Deployment

### AWS EC2 Deployment mit CloudFormation

1. **CloudFormation Stack erstellen:**
```bash
aws cloudformation create-stack \
  --stack-name study-organizer-stack \
  --template-body file://cloudformation-template.yml \
  --parameters \
    ParameterKey=KeyName,ParameterValue=your-key-pair \
    ParameterKey=MongoDBURI,ParameterValue=your-mongodb-uri \
    ParameterKey=JWTSecret,ParameterValue=your-jwt-secret \
  --region eu-central-1
```

2. **Stack Status prüfen:**
```bash
aws cloudformation describe-stacks --stack-name study-organizer-stack
```

3. **Outputs abrufen:**
```bash
aws cloudformation describe-stacks \
  --stack-name study-organizer-stack \
  --query 'Stacks[0].Outputs'
```

4. **Manual Fix (einmalig nach Stack-Erstellung):**
```bash
# SSH zum Server
ssh -i your-key.pem ubuntu@<PUBLIC_IP>

# Frontend .env setzen
cd Study-Organizer
echo "VITE_API_URL=http://<PUBLIC_IP>:5000/api" > frontend/.env
sudo docker compose down && sudo docker compose up -d --build
```

### Deployment-Konfiguration

**Server-Spezifikationen:**
- **Instance Type:** t3.micro (Free Tier eligible)
- **OS:** Ubuntu 24.04 LTS
- **Region:** eu-central-1 (Frankfurt)
- **Ports:** 22 (SSH), 80, 443, 5000 (Backend), 5173 (Frontend)

**Stack löschen (nach Präsentation):**
```bash
aws cloudformation delete-stack --stack-name study-organizer-stack
```

##  CI/CD Pipeline

### GitHub Actions Workflow

**Automatisches Deployment bei Git Push:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [ main ]
  workflow_dispatch:
```

**Workflow-Schritte:**
1. Checkout Code
2. SSH zum EC2 Server
3. Git Pull (neuester Code)
4. Environment Variables setzen
5. Docker Container neu bauen
6. Deployment verifizieren

### GitHub Secrets konfigurieren

Erforderliche Secrets in GitHub Repository Settings:

```
SSH_PRIVATE_KEY=<content-of-your-pem-file>
EC2_HOST=<public-ip-address>
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
SES_FROM_EMAIL=<verified-email>
S3_BUCKET_NAME=<bucket-name>
```

### Deployment testen

```bash
# Code ändern
git add .
git commit -m "Test: Auto-deployment"
git push origin main

# GitHub Actions Tab öffnen und Workflow verfolgen
# Nach 2-3 Minuten: App prüfen
```

##  Verwendung

### Benutzer-Workflow

1. **Registrierung:**
   - Email und Passwort eingeben
   - Account wird erstellt
   - Automatischer Login

2. **Dashboard:**
   - Übersicht aller Bereiche
   - Schnellzugriff auf Features

3. **Kontakte verwalten:**
   - Neue Kontakte hinzufügen
   - Lerngruppen organisieren
   - Kontaktinformationen bearbeiten

4. **Events erstellen:**
   - Termine und Deadlines eintragen
   - Kategorie zuweisen
   - Kalenderansicht nutzen

5. **Links sammeln:**
   - Wichtige Webseiten speichern
   - Kategorien erstellen
   - Schnell darauf zugreifen

6. **Dateien hochladen:**
   - Dokumente organisieren
   - Ordnerstruktur erstellen
   - Dateien herunterladen

7. **Password Reset:**
   - "Passwort vergessen" klicken
   - Email mit Reset-Link erhalten
   - Neues Passwort setzen

## 📡 API Dokumentation

### Authentication

**POST /api/auth/register**
```json
{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**POST /api/auth/login**
```json
{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**POST /api/auth/forgot-password**
```json
{
  "email": "student@example.com"
}
```

**POST /api/auth/reset-password**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

### Protected Routes

Alle anderen API-Endpunkte benötigen JWT Token im Header:
```
Authorization: Bearer <jwt-token>
```

### Endpoints

- **Contacts:** `/api/contacts`
- **Events:** `/api/events`
- **Links:** `/api/links`
- **Folders:** `/api/folders`
- **Files:** `/api/files`
- **Search:** `/api/search`

##  Projektstruktur

```
Study-Organizer/
├── frontend/                # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── pages/          # Page Components
│   │   ├── App.jsx         # Main App Component
│   │   └── main.jsx        # Entry Point
│   ├── .env                # Frontend Environment Variables
│   ├── Dockerfile          # Frontend Container
│   └── package.json
│
├── backend/                 # Node.js Backend
│   ├── models/             # Mongoose Models
│   ├── routes/             # Express Routes
│   ├── middleware/         # Custom Middleware
│   ├── .env                # Backend Environment Variables
│   ├── server.js           # Entry Point
│   ├── Dockerfile          # Backend Container
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD Pipeline
│
├── cloudformation-template.yml  # AWS Infrastructure
├── docker-compose.yml      # Container Orchestration
└── README.md               # This file
```

##  Entwicklung

### Code-Stil

**Frontend:**
- React Functional Components mit Hooks
- Axios für API-Calls
- CSS für Styling

**Backend:**
- Express Router Pattern
- Async/Await für asynchrone Operationen
- Middleware für Authentication

### Datenbank-Schema

**User:**
```javascript
{
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

**Contact, Event, Link, File:** Siehe `/backend/models/`

### Testing

```bash
# Backend Tests (wenn vorhanden)
cd backend
npm test

# Frontend Tests (wenn vorhanden)
cd frontend
npm test
```

##  Lessons Learned

### Technische Herausforderungen

1. **Environment Variables in Docker:**
   - Problem: Vite benötigt Build-Time Environment Variables
   - Lösung: docker-compose.yml mit expliziten Environment-Variablen

2. **AWS SDK Versionskompatibilität:**
   - Problem: multer-s3 v3 funktioniert nur mit AWS SDK v3
   - Lösung: Migration zu AWS SDK v2 + multer-s3 v2

3. **Frontend-Backend Kommunikation:**
   - Problem: CORS und API URL Konfiguration
   - Lösung: Richtige Environment Variable Verwaltung

4. **CI/CD Pipeline:**
   - Problem: Secrets durch SSH heredoc nicht übertragbar
   - Lösung: Separate SSH-Befehle für Secret-Injection

### Was ich gelernt habe

- **Docker & Container-Orchestration**
- **AWS CloudFormation (Infrastructure as Code)**
- **CI/CD mit GitHub Actions**
- **Full-Stack Development mit React und Node.js**
- **NoSQL Datenbank-Design mit MongoDB**
- **JWT Authentication Implementation**
- **AWS Services Integration (EC2, SES, CloudFormation)**
- **Systematisches Debugging komplexer Probleme**

### Verbesserungsmöglichkeiten

- [ ] Unit & Integration Tests
- [ ] AWS S3 für permanente File-Speicherung
- [ ] Eigene Domain mit SSL/HTTPS
- [ ] Mobile App (React Native)
- [ ] Push-Benachrichtigungen
- [ ] Echtzeit-Kollaboration (WebSockets)
- [ ] Produktionsmodus für AWS SES (exit Sandbox)

## 👤 Autor

**Najat Bouzerouata**

- GitHub: [@NajatBouz](https://github.com/NajatBouz)
- Projekt: [Study-Organizer](https://github.com/NajatBouz/Study-Organizer)

## 📝 Lizenz

Dieses Projekt wurde als Abschlussprojekt entwickelt und wird weiter entwickelt.

