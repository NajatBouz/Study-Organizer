# Study Organizer
Study Organizer unterstützt dich dabei, deine Kursteilnahme zu begleiten und zu organisieren. Verwalte Kontakte, Links, Ordner und Termine an einem Ort – alles übersichtlich und einfach.

## Aktueller Stand

###  Komplett implementiert

**Backend:**
- Node.js, Express und MongoDB (Atlas)
- Benutzerregistrierung und Login (JWT-Authentifizierung)
- Passwort-Reset Funktionalität
- Kontakte erstellen, bearbeiten und löschen
- Links erstellen, bearbeiten und löschen
- Termine mit Start- und Endzeit
- Ordner mit File-Upload (PDF, Word, Excel, Bilder, etc.)
- Globale Suchfunktion über alle Module
- Sichere API mit geschützten Routes

**Frontend:**
- React.js mit Vite
- Responsive Design mit Tailwind CSS
- Dashboard mit Aktivitäts-Feed und Statistiken
- Dark Mode (hell/dunkel Modus)
- Zweisprachigkeit (Deutsch/Englisch)
- Kontakte-Verwaltung mit Kategorien
- Links-Verwaltung mit Notizen
- Termine-Verwaltung mit Datum & Zeit
- Ordner-System mit File-Upload und Download
- Intelligente Suche mit Highlight-Effekt
- Impressum, Datenschutz, Nutzungsbedingungen

**Design & UX:**
- Moderne Glassmorphismus-UI mit Gradienten
- Highlight-Effekt beim Klick auf Aktivitäten
- Automatisches Scrollen zu gesuchten Items
- Animierte Übergänge und Hover-Effekte
- Responsive für Desktop, Tablet und Mobile

## Features im Detail

###  Module
- **Kontakte** - Speichere Kontakte mit Name, E-Mail, Telefon, Rolle und Kategorie
- **Links** - Organisiere wichtige Webseiten mit Titel, URL, Kategorie und Notizen
- **Termine** - Plane Events mit Start-/Endzeit und optionaler Beschreibung
- **Ordner** - Erstelle Ordner und lade Dateien hoch (max. 10MB)

###  Suche
- Durchsuche alle Kontakte, Links, Termine und Ordner
- Klick auf Suchergebnisse führt zum Item mit Highlight-Effekt
- Echtzeit-Suche mit sofortigen Ergebnissen

###  Dashboard
- Willkommens-Nachricht mit Benutzernamen
- Nächster anstehender Termin mit Countdown
- Letzte 5 Aktivitäten (klickbar)
- Live-Statistiken über alle Module
- Schnellzugriff-Karten zu allen Bereichen

###  Design-Features
- **Dark Mode** - Wechsel zwischen hellem und dunklem Design
- **Zweisprachig** - Komplett auf Deutsch und Englisch
- **Responsive** - Funktioniert auf allen Geräten
- **Animationen** - Smooth Transitions und Hover-Effekte

###  Sicherheit
- JWT-basierte Authentifizierung
- Bcrypt Passwort-Verschlüsselung
- Passwort-Reset mit sicheren Tokens
- Protected Routes im Frontend und Backend
- CORS-Konfiguration

###  Rechtliches
- DSGVO-konforme Datenschutzerklärung
- Vollständiges Impressum
- Nutzungsbedingungen mit Hinweis auf kostenlose Nutzung

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB Atlas (Cloud-Datenbank)
- JWT (JSON Web Tokens)
- Bcrypt (Password Hashing)
- Multer (File Upload)
- Mongoose (MongoDB ODM)

**Frontend:**
- React.js 18.3
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- Axios (HTTP Client)
- React Router (Routing)

## Installation

### Voraussetzungen
- Node.js (v20+)
- MongoDB Atlas Account
- Git

### Backend Setup

1. Repository klonen:
   ```bash
   git clone https://github.com/DEIN-USERNAME/study-organizer.git
   cd study-organizer/backend
   ```

2. Dependencies installieren:
   ```bash
   npm install
   ```

3. `.env` Datei erstellen:
   ```env
   MONGODB_URI=deine_mongodb_connection_string
   JWT_SECRET=dein_geheimer_schlüssel
   PORT=5000
   ```

4. Server starten:
   ```bash
   npm start
   ```

### Frontend Setup

1. Frontend-Ordner öffnen:
   ```bash
   cd ../frontend
   ```

2. Dependencies installieren:
   ```bash
   npm install
   ```

3. Dev-Server starten:
   ```bash
   npm run dev
   ```

App läuft auf: `http://localhost:5173`

## API Endpoints

### Authentication
```
POST   /api/auth/register          # Registrierung
POST   /api/auth/login             # Login
POST   /api/auth/forgot-password   # Passwort vergessen
POST   /api/auth/reset-password    # Passwort zurücksetzen
```

### Contacts
```
GET    /api/contacts               # Alle Kontakte
POST   /api/contacts               # Kontakt erstellen
PUT    /api/contacts/:id           # Kontakt bearbeiten
DELETE /api/contacts/:id           # Kontakt löschen
```

### Links
```
GET    /api/links                  # Alle Links
POST   /api/links                  # Link erstellen
PUT    /api/links/:id              # Link bearbeiten
DELETE /api/links/:id              # Link löschen
```

### Events
```
GET    /api/events                 # Alle Termine
GET    /api/events/upcoming        # Anstehende Termine
POST   /api/events                 # Termin erstellen
PUT    /api/events/:id             # Termin bearbeiten
DELETE /api/events/:id             # Termin löschen
```

### Folders & Files
```
GET    /api/folders                # Alle Ordner
POST   /api/folders                # Ordner erstellen
PUT    /api/folders/:id            # Ordner umbenennen
DELETE /api/folders/:id            # Ordner löschen
POST   /api/files/upload           # Datei hochladen
GET    /api/files/download/:id     # Datei herunterladen
DELETE /api/files/:id              # Datei löschen
```

### Search
```
GET    /api/search?q=begriff       # Globale Suche
```

## Projektstruktur

```
study-organizer/
├── backend/
│   ├── models/           # MongoDB Schemas
│   ├── routes/           # API Endpoints
│   ├── middleware/       # Auth Middleware
│   ├── uploads/          # Hochgeladene Dateien
│   └── server.js         # Express Server
├── frontend/
│   ├── src/
│   │   ├── components/   # React Komponenten
│   │   ├── contexts/     # Dark Mode & Language
│   │   ├── pages/        # Seiten
│   │   └── api.js        # Axios Config
│   └── public/           # Statische Dateien
└── README.md
```

## Zukünftige Erweiterungen

- E-Mail-Versand für Passwort-Reset
- Cloud-Storage für Dateien (z.B. AWS S3)
- Push-Benachrichtigungen für Termine
- Kalender-Ansicht für Events
- Export-Funktion (PDF, CSV)
- Teilen von Ordnern mit anderen Nutzern
- Mobile App (React Native)

## Lizenz

Abschlussprojekt - Study Organizer  
Entwickelt von Najat Bouerouata

---

**Viel Erfolg beim Organisieren!**# CI/CD Pipeline aktiv!
# CI/CD Test - Tue, Jan 13, 2026 11:34:14 AM
