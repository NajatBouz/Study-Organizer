const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoute = require("./routes/auth");
const contactRoute = require("./routes/contacts");
const linkRoute = require("./routes/links"); 
const folderRoute = require("./routes/folders");
const fileRoute = require("./routes/files");  
const eventRoute = require("./routes/events"); 
const searchRoute = require("./routes/search"); 
const userRoute = require("./routes/users");
const passwordResetRoute = require("./routes/passwordReset");

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

// Folder-Routen
app.use("/api/folders", folderRoute);
console.log("Folder routes are set up");

// File-Routen  
app.use("/api/files", fileRoute);
console.log("File routes are set up");

// Events-Routen
app.use("/api/events", eventRoute);
console.log("Event routes are set up");

// Search-Routen
app.use("/api/search", searchRoute);
console.log("Search route is set up");

// User-Routen
app.use("/api/users", userRoute);
console.log("User routes are set up");

// Password Reset-Routen
app.use("/api/auth", passwordResetRoute);
console.log("Password Reset routes are set up");

// Server starten
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend läuft auf Port ${port}`);
});

