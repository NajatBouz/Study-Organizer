const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const AWS = require("aws-sdk");

const router = express.Router();

// AWS SES Client konfigurieren
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "eu-central-1",
});

const ses = new AWS.SES();

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

    // Get current domain (from environment or use EC2 IP)
    const domain = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${domain}/reset-password?token=${resetToken}`;
    
    // Send email via AWS SES
    const emailParams = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [user.email]
      },
      Message: {
        Subject: {
          Data: "Study Organizer - Passwort zurücksetzen",
          Charset: "UTF-8"
        },
        Body: {
          Html: {
            Data: `
              <h2>Passwort zurücksetzen</h2>
              <p>Du hast eine Passwort-Zurücksetzung angefordert.</p>
              <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
              <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Passwort zurücksetzen
              </a>
              <p>Dieser Link ist 1 Stunde gültig.</p>
              <p>Falls du diese Anfrage nicht gestellt hast, ignoriere diese Email.</p>
              <br>
              <p style="color: #666; font-size: 12px;">Study Organizer App</p>
            `,
            Charset: "UTF-8"
          }
        }
      }
    };

    try {
      await ses.sendEmail(emailParams).promise();
      
      console.log(`✅ Password reset email sent to: ${user.email}`);
      
      res.json({ 
        message: "Eine Email mit Anweisungen zum Zurücksetzen des Passworts wurde an deine Email-Adresse gesendet."
      });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      
      // Fallback: Log to console (nur für Development)
      if (process.env.NODE_ENV === 'development') {
        console.log("\n=================================");
        console.log("🔐 PASSWORD RESET TOKEN (Email failed, showing here)");
        console.log("=================================");
        console.log(`User: ${user.email}`);
        console.log(`Reset Link: ${resetUrl}`);
        console.log(`Token expires in: 1 hour`);
        console.log("=================================\n");
      }
      
      res.status(500).json({ 
        error: "Email konnte nicht gesendet werden. Bitte später erneut versuchen." 
      });
    }

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

    // Finde den user mit validen token
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