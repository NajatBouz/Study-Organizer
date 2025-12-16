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

// Kontakt aktualisieren (PUT)
router.put("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Kontakt nicht gefunden" });
    }

    // Prüfen, ob der Kontakt dem Benutzer gehört
    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Nicht berechtigt, diesen Kontakt zu bearbeiten",
      });
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

// Kontakt löschen (DELETE)
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("Authorization Header:", req.header("Authorization"));
    console.log("Contact ID aus URL:", req.params.id);
    console.log("User ID aus Token:", req.user.id);

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Kontakt nicht gefunden" });
    }

    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Nicht berechtigt, diesen Kontakt zu löschen",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({ message: "Kontakt gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen:", err.message);
    res.status(500).json({ error: "Fehler beim Löschen des Kontakts" });
  }
});


// startet Express 
module.exports = router;





