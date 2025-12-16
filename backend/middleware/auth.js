const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer TOKEN

  // Optional: Nur in Entwicklungsumgebung loggen
  if (process.env.NODE_ENV === "development") {
    console.log("Token received:", token); // Ausgabe des Tokens zur Überprüfung
  }

  if (!token) {
    return res.status(401).json({ error: "Kein Token, Zugriff verweigert" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // { id: user._id }
    next();
  } catch (err) {
    // Verbesserung: Präzisere Fehlerbehandlung
    res.status(400).json({ error: "Token ungültig oder abgelaufen" });
  }
}

module.exports = auth;


