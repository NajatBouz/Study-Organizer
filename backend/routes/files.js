const express = require("express");
const { upload, s3 } = require("../uploadConfig");
const File = require("../models/File");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all files for a folder (backwards compatibility)
router.get("/folder/:folderId", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({
      folderId: req.params.folderId,
      userId: req.user.id,
    });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server-Fehler" });
  }
});

// Upload file to S3
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Keine Datei hochgeladen" });
    }

    const { folderId } = req.body;

    // File is already uploaded to S3 by multer-s3
    // req.file.location contains the S3 URL
    const newFile = new File({
      name: req.file.originalname,
      url: req.file.location, // S3 URL
      s3Key: req.file.key, // S3 object key for deletion
      folderId: folderId || null,
      userId: req.user.id,
    });

    await newFile.save();
    res.json(newFile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server-Fehler" });
  }
});

// Get all files for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { folderId } = req.query;
    const query = { userId: req.user.id };

    if (folderId) {
      query.folderId = folderId;
    } else {
      query.folderId = null;
    }

    const files = await File.find(query);
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server-Fehler" });
  }
});

// Delete file
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user.id });

    if (!file) {
      return res.status(404).json({ error: "Datei nicht gefunden" });
    }

    // Delete from S3 (SDK v2)
    if (file.s3Key) {
      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.s3Key,
      };

      try {
        await s3.deleteObject(deleteParams).promise();
        console.log(` File deleted from S3: ${file.s3Key}`);
      } catch (s3Error) {
        console.error("❌ S3 deletion failed:", s3Error);
        // Continue with database deletion even if S3 fails
      }
    }

    // Delete from database
    await File.deleteOne({ _id: req.params.id });
    res.json({ message: "Datei gelöscht" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server-Fehler" });
  }
});

module.exports = router;