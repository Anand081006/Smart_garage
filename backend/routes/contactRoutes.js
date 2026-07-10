const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Send contact message
router.post("/send", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  db.query(
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)",
    [name, email, phone, message],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error saving message", error: err });
      res.status(201).json({ message: "Message sent successfully" });
    }
  );
});

// Get all contact messages
router.get("/messages", (req, res) => {
  db.query(
    "SELECT * FROM contacts ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json(results);
    }
  );
});

module.exports = router;