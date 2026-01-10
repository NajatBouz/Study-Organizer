const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  
  console.log('METHOD:', req.method);
  console.log('RAW AUTH HEADER:', req.headers.authorization);
  console.log('BODY:', req.body);

  // Token aus dem Authorization-Header extrahieren
  const authHeader = req.header("Authorization");

  // Prüfen, ob der Header vorhanden ist
  if (!authHeader) {
    return res.status(401).json({ error: "Kein Token, Zugriff verweigert" });
  }

  // Token extrahieren: "Bearer <Token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(400).json({ error: "Ungültiger Token-Header" });
  }

  const token = parts[1];
  if (!token) {
    return res.status(400).json({ error: "Kein Token gefunden" });
  }

  try {
    // Token überprüfen
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // z. B. { id: user._id }
    next(); // Weiter zur Route
  } catch (err) {
    console.log("Token Error:", err.message); // Debugging
    res.status(400).json({ error: "Token ungültig oder abgelaufen" });
  }
}

module.exports = auth;




