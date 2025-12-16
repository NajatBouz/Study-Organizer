const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./routes/auth");
const contactRoute = require("./routes/contacts"); // Kontakte-Routen importieren

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB-Verbindung
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB verbunden"))
  .catch(err => {
    console.error("Fehler bei der MongoDB-Verbindung: ", err);
    process.exit(1); // Beendet den Server, wenn die DB nicht erreichbar ist
  });

// Auth-Routen einbinden
app.use("/api/auth", authRoute);
console.log("Auth routes are set up");

// Kontakte-Routen einbinden
app.use("/api/contacts", contactRoute);
console.log("Contact routes are set up");

// Server starten
const port = process.env.PORT || 5000; // Default Port auf 5000 setzen, wenn nicht in .env definiert
app.listen(port, () => {
  console.log(`Backend läuft auf Port ${port}`);
});

