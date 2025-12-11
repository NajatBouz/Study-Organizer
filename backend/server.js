const express = require("express"); 
const app = express(); 
app.get("/", (req, res) => res.send("Server läuft")); 
app.listen(5000, () => console.log("Backend läuft auf Port 5000")); 