const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrierung
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Bitte email, password und name angeben" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "E-Mail bereits registriert" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, name });
    await user.save();

    res.status(201).json({ message: "User erstellt" });
  } catch (err) {
    console.error("Registrierungs-Fehler:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email und Passwort angeben" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User nicht gefunden" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Falsches Passwort" });

    // JWT erstellen
    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // User-Daten mitschicken
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Login-Fehler:", err);
    res.status(500).json({ error: "Fehler beim Login" });
  }
});

module.exports = router;
