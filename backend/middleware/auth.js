const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  // Token aus dem Authorization-Header extrahieren
  const authHeader = req.header("Authorization");

  // Prüfen, ob der Header vorhanden ist
  if (!authHeader) {
    return res.status(401).json({ error: "Kein Token, Zugriff verweigert" });
  }

  // Token extrahieren: "Bearer <Token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Ungültiger Token-Header" });
  }

  try {
    // Token überprüfen
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // { id: user._id }
    next(); // Weiter zur Route
  } catch (err) {
    console.log("Token Error:", err.message); // Optional für Debugging
    res.status(400).json({ error: "Token ungültig oder abgelaufen" });
  }
}

module.exports = auth;



