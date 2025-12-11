const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Registrierung
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Bitte email, password und name angeben" });
  }

  try {
    // Prüfen, ob der Benutzer schon existiert
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "E-Mail bereits registriert" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name });
    await user.save();
    res.status(201).json({ message: "User erstellt" });
  } catch (err) {
    console.error("Registrierungs-Fehler:", err); // zeigt den Fehler im Terminal
    // Wenn trotz Vorprüfung ein Duplicate-Key-Fehler auftritt, gebe 409 zurück
    if (err && err.code === 11000) {
      return res.status(409).json({ error: "E-Mail bereits registriert" });
    }
    res.status(500).json({ error: err.message }); // gibt die echte Fehlermeldung zurück
  }
});

module.exports = router;


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Bitte Email und Passwort angeben" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User nicht gefunden" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Falsches Passwort" });

    res.json({
      message: "Login erfolgreich",
      user: {
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error("Login-Fehler:", err);
    res.status(500).json({ error: "Fehler beim Login" });
  }
});
