const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Bitte eine gültige E-Mail-Adresse angeben']
  },
  phone: {
    type: String,
    required: true,
    match: [/^\+?[0-9]{1,3}?[ -]?\(?\d{1,4}\)?[ -]?\d{1,4}[ -]?\d{1,4}$/, 'Bitte eine gültige Telefonnummer angeben']
  },
  category: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Verweis auf das User Modell
    required: true
  }
}, { timestamps: true });  // Automatisch createdAt und updatedAt Felder hinzufügen

module.exports = mongoose.model("Contact", ContactSchema);
