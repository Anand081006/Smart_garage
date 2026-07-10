const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");  
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const contactRoutes = require("./routes/contactRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Smart Garage Backend Running ");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});