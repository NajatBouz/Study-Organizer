const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
const auth = require("../middleware/auth");

// 🔹 Alle Ordner des angemeldeten Users
router.get("/", auth, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id });
    res.json(folders);
  } catch (err) {
    console.error("Fehler beim Abrufen der Ordner:", err.message);
    res.status(500).json({ error: "Fehler beim Abrufen der Ordner" });
  }
});

// 🔹 Neuen Ordner erstellen
router.post("/", auth, async (req, res) => {
  try {
    const newFolder = new Folder({
      name: req.body.name,
      userId: req.user.id
    });

    await newFolder.save();
    res.json(newFolder);
  } catch (err) {
    console.error("Fehler beim Erstellen des Ordners:", err.message);
    res.status(400).json({ error: "Fehler beim Erstellen des Ordners" });
  }
});

// 🔹 Ordner umbenennen
router.put("/:id", auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ error: "Ordner nicht gefunden" });
    }

    if (folder.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Nicht berechtigt" });
    }

    folder.name = req.body.name || folder.name;
    await folder.save();

    res.json(folder);
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Ordners:", err.message);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Ordners" });
  }
});

// 🔹 Ordner löschen
router.delete("/:id", auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ error: "Ordner nicht gefunden" });
    }

    if (folder.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Nicht berechtigt" });
    }

    await folder.deleteOne();
    res.json({ message: "Ordner gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen des Ordners:", err.message);
    res.status(500).json({ error: "Fehler beim Löschen des Ordners" });
  }
});

module.exports = router;
