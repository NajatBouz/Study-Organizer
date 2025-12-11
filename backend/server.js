const express = require("express"); 
const mongoose = require("mongoose"); 
const cors = require("cors"); 
require("dotenv").config(); 
const authRoute = require("./routes/auth"); 
const app = express(); 
app.use(cors()); 
app.use(express.json()); 
mongoose.connect(process.env.MONGODB_URI) 
.then(() => console.log("MongoDB verbunden")) 
.catch(err => console.log(err)); 
app.use("/api/auth", authRoute); 
app.listen(process.env.PORT, () => console.log(`Backend läuft auf 
Port ${process.env.PORT}`)); 