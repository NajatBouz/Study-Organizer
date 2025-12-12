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
  .catch(err => console.log(err));

// Auth-Routen einbinden
app.use("/api/auth", authRoute);

// Kontakte-Routen einbinden
app.use("/api/contacts", contactRoute); // Kontakte-Route hinzufügen

// Server starten
app.listen(process.env.PORT, () => console.log(`Backend läuft auf Port ${process.env.PORT}`));
