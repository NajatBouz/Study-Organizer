const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },       // Name des Links
    url: { type: String, required: true },         // URL
    category: { type: String },                    // Kategorie (z.B. Lernen, Arbeit, etc.)
    note: { type: String },                        // Notizen zum Link

    // Zuordnung zu einem Ordner
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", LinkSchema);

