require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Verbindung erfolgreich!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Fehler bei der Verbindung:", err);
  });

