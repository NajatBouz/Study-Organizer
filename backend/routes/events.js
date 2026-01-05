const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// 🔹 Alle Events des Users
router.get("/", auth, async (req, res) => {
  const events = await Event.find({ userId: req.user.id });
  res.json(events);
});

// 🔹 Zukünftige Events abrufen (für Dashboard)
router.get("/upcoming", auth, async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ 
      userId: req.user.id,
      start: { $gte: now } // nur zukünftige Events
    }).sort({ start: 1 }); // aufsteigend nach Startdatum
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Abrufen der kommenden Termine" });
  }
});

// 🔹 Event erstellen
router.post("/", auth, async (req, res) => {
  const newEvent = new Event({
    ...req.body,
    userId: req.user.id,
  });

  await newEvent.save();
  res.status(201).json(newEvent);
});

// 🔹 Event aktualisieren
router.put("/:id", auth, async (req, res) => {
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );

  if (!updatedEvent) {
    return res.status(404).json({ error: "Event nicht gefunden" });
  }

  res.json(updatedEvent);
});

// 🔹 Event löschen
router.delete("/:id", auth, async (req, res) => {
  await Event.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Event gelöscht" });
});

module.exports = router;


