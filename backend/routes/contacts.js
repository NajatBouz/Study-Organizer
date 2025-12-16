const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

// Alle Kontakte des Users abrufen
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

// ✅ KONTAKT AKTUALISIEREN (PUT)
router.put("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Kontakt nicht gefunden" });
    }

    // Prüfen, ob der Kontakt dem Benutzer gehört
    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Nicht berechtigt, diesen Kontakt zu bearbeiten" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedContact);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Aktualisieren des Kontakts" });
  }
});

// Kontakt löschen
router.delete("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Kontakt nicht gefunden" });
    }

    // Prüfen, ob der Kontakt dem Benutzer gehört
    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Nicht berechtigt, diesen Kontakt zu löschen" });
    }

    await contact.remove();
    res.json({ message: "Kontakt gelöscht" });
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Löschen des Kontakts" });
  }
});

module.exports = router;



