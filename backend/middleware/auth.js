const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ error: "Kein Token, Zugriff verweigert" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // { id: user._id }
    next();
  } catch (err) {
    res.status(400).json({ error: "Token ungültig" });
  }
}

module.exports = auth;
