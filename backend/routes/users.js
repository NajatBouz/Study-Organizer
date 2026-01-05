const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Account löschen
router.delete("/me", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account gelöscht" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Löschen des Accounts" });
  }
});

module.exports = router;
