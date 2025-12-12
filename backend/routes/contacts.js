const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

// Alle Kontakte des Users
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Abrufen der Kontakte" });
  }
});

// Kontakt hinzufügen
router.post("/", auth, async (req, res) => {
  try {
    const newContact = new Contact({ ...req.body, userId: req.user.id });
    await newContact.save();
    res.json(newContact);
  } catch (err) {
    res.status(400).json({ error: "Fehler beim Hinzufügen des Kontakts" });
  }
});

module.exports = router;
