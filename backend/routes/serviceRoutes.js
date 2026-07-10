const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all services
router.get("/all", (req, res) => {
  db.query("SELECT * FROM services", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(results);
  });
});

// Add new service
router.post("/add", (req, res) => {
  const { name, description, price, duration } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  db.query(
    "INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)",
    [name, description, price, duration],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error adding service" });
      res.status(201).json({ message: "Service added successfully ✅" });
    }
  );
});

// Edit service
router.put("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration } = req.body;

  db.query(
    "UPDATE services SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?",
    [name, description, price, duration, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating service" });
      res.status(200).json({ message: "Service updated successfully ✅" });
    }
  );
});

// Delete service
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM services WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting service" });
    res.status(200).json({ message: "Service deleted successfully ✅" });
  });
});

module.exports = router;