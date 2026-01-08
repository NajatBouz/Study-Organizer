const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const auth = require("../middleware/auth");

// Uploads Ordner erstellen falls nicht vorhanden
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Konfiguration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

// File Filter - Erlaubte Dateitypen
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Dokumente
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    // Bilder
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    // Archive
    "application/zip",
    "application/x-rar-compressed"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Dateityp nicht erlaubt!"), false);
  }
};

// Multer Upload Middleware - Max 10MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// 🔹 Alle Dateien eines Ordners abrufen
router.get("/folder/:folderId", auth, async (req, res) => {
  try {
    const files = await File.find({
      folderId: req.params.folderId,
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("Fehler beim Abrufen der Dateien:", err.message);
    res.status(500).json({ error: "Fehler beim Abrufen der Dateien" });
  }
});

// 🔹 Datei hochladen
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Keine Datei hochgeladen" });
    }

    if (!req.body.folderId) {
      return res.status(400).json({ error: "Ordner ID fehlt" });
    }

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      folderId: req.body.folderId,
      userId: req.user.id
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (err) {
    console.error("Fehler beim Hochladen:", err.message);
    res.status(500).json({ error: "Fehler beim Hochladen der Datei" });
  }
});

// 🔹 Datei herunterladen
router.get("/download/:id", auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({ error: "Datei nicht gefunden" });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: "Datei existiert nicht auf dem Server" });
    }

    res.download(file.path, file.originalName);
  } catch (err) {
    console.error("Fehler beim Download:", err.message);
    res.status(500).json({ error: "Fehler beim Download" });
  }
});

// 🔹 Datei löschen
router.delete("/:id", auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({ error: "Datei nicht gefunden" });
    }

    // Datei vom Server löschen
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Datenbank Eintrag löschen
    await file.deleteOne();

    res.json({ message: "Datei erfolgreich gelöscht" });
  } catch (err) {
    console.error("Fehler beim Löschen:", err.message);
    res.status(500).json({ error: "Fehler beim Löschen der Datei" });
  }
});

module.exports = router;