const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoute = require("./routes/auth");
const contactRoute = require("./routes/contacts");
const linkRoute = require("./routes/links"); 

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB-Verbindung
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB verbunden"))
  .catch(err => {
    console.error("Fehler bei der MongoDB-Verbindung: ", err);
    process.exit(1);
  });

// Auth-Routen
app.use("/api/auth", authRoute);
console.log("Auth routes are set up");

// Contacts-Routen
app.use("/api/contacts", contactRoute);
console.log("Contact routes are set up");

// Links-Routen
app.use("/api/links", linkRoute);
console.log("Link routes are set up");

// Server starten
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend läuft auf Port ${port}`);
});


