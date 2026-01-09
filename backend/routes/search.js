const express = require("express");
const router = express.Router();
const Link = require("../models/Link");
const Folder = require("../models/Folder");
const Contact = require("../models/Contact");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// Globale Suche
// GET /api/search?q=<Suchbegriff>
router.get("/", auth, async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json([
      { type: "contact", results: [] },
      { type: "link", results: [] },
      { type: "event", results: [] },
      { type: "folder", results: [] }
    ]);
  }

  const regex = new RegExp(q, "i"); // Case-insensitive Suche

  try {
    const contacts = await Contact.find({ userId: req.user.id, name: regex });
    const links = await Link.find({ userId: req.user.id, title: regex });
    const events = await Event.find({ userId: req.user.id, title: regex });
    const folders = await Folder.find({ userId: req.user.id, name: regex });

    // Format für Frontend: Array mit type + results
    const results = [
      { type: "contact", results: contacts },
      { type: "link", results: links },
      { type: "event", results: events },
      { type: "folder", results: folders }
    ];

    res.json(results);
  } catch (err) {
    console.error("Fehler bei der Suche:", err.message);
    res.status(500).json({ error: "Fehler bei der Suche" });
  }
});

module.exports = router;
