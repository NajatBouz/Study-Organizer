const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

// Request password reset (generates token)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Kein Benutzer mit dieser E-Mail gefunden" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Sichere token vom user (entfällt in 1 stunde)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 Stunde
    await user.save();

    // In production, sende email hier mit dem reset link
    // erst mal für meine Entwicklung, log den reset link
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    console.log("\n=================================");
    console.log("🔐 PASSWORD RESET TOKEN");
    console.log("=================================");
    console.log(`User: ${user.email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log(`Token expires in: 1 hour`);
    console.log("=================================\n");

    res.json({ 
      message: "Passwort-Reset angefordert. Token wurde in der Console ausgegeben.",
      resetUrl // Nur fürs Projekt erst!
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server-Fehler" });
  }
});

// Reset password mit token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token und neues Passwort erforderlich" });
    }

    // Hash den token zum vergleich mit Datenbank
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Finde den user mit  validen token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Ungültiger oder abgelaufener Token" });
    }

    // Hash neues password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password und clear den reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Password reset successful for: ${user.email}`);

    res.json({ message: "Passwort erfolgreich zurückgesetzt!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server-Fehler" });
  }
});

module.exports = router;