const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// Alle Events des Users
router.get("/", auth, async (req, res) => {
  const events = await Event.find({ userId: req.user.id });
  res.json(events);
});

// Event erstellen
router.post("/", auth, async (req, res) => {
  const newEvent = new Event({
    ...req.body,
    userId: req.user.id,
  });

  await newEvent.save();
  res.status(201).json(newEvent);
});

// Event aktualisieren
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

// Event löschen
router.delete("/:id", auth, async (req, res) => {
  await Event.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Event gelöscht" });
});

module.exports = router;

