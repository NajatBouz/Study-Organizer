const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }, // S3 URL
  s3Key: { type: String, required: true }, // S3 object key
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);