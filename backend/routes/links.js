const express = require("express");
const router = express.Router();
const Link = require("../models/Link");  
const auth = require("../middleware/auth");

// Alle Links des angemeldeten Users abrufen 
router.get("/", auth, async (req, res) => {
  try {
    const filter = { userId: req.user.id };

    // Wenn folderId in der URL vorhanden ist
    if (req.query.folderId) {
      filter.folderId = req.query.folderId;
    }

    const links = await Link.find(filter);
    res.json(links);
  } catch (err) {
    console.error("Fehler beim Abrufen der Links:", err.message);
    res.status(500).json({ error: "Fehler beim Abrufen der Links" });
  }
});

// Neuen Link erstellen 
router.post("/", auth, async (req, res) => {
  try {
    const newLink = new Link({
      title: req.body.title,
      url: req.body.url,
      category: req.body.category,
      note: req.body.note,
      folderId: req.body.folderId || null, //  Ordner-Zuordnung
      userId: req.user.id
    });

    await newLink.save();
    res.json(newLink);
  } catch (err) {
    console.error("Fehler beim Hinzufügen des Links:", err.message);
    res.status(400).json({ error: "Fehler beim Hinzufügen des Links" });
  }
});

// Einen Link aktualisieren
router.put("/:id", auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: "Link nicht gefunden" });
    }

    if (link.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Nicht berechtigt, diesen Link zu bearbeiten" });
    }

    const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLink);
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Links:", err.message);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Links" });
  }
});

// Einen Link löschen
router.delete("/:id", auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ error: "Link nicht gefunden" });
    }

    if (link.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Nicht berechtigt, diesen Link zu löschen" });
    }

    await link.deleteOne(); // mongoose-Dokument löschen
    res.json({ message: "Link gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen des Links:", err.message);
    res.status(500).json({ error: "Fehler beim Löschen des Links" });
  }
});

module.exports = router;

