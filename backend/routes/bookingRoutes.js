const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Create booking
router.post("/create", (req, res) => {
  const {
    customer_name, phone, vehicle_number, vehicle_type,
    vehicle_brand, service, date, time_slot,
    pickup_type, delivery_type, address
  } = req.body;

  if (!customer_name || !vehicle_number || !service || !date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  db.query(
    `INSERT INTO bookings 
    (customer_name, phone, vehicle_number, vehicle_type, vehicle_brand, service, date, time_slot, pickup_type, delivery_type, address) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [customer_name, phone, vehicle_number, vehicle_type, vehicle_brand, service, date, time_slot, pickup_type, delivery_type, address],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error saving booking", error: err });
      res.status(201).json({ message: "Booking confirmed successfully", bookingId: result.insertId });
    }
  );
});

// Get all bookings
router.get("/all", (req, res) => {
  db.query("SELECT * FROM bookings ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(results);
  });
});

// Get my bookings by customer name
router.get("/mybookings/:name", (req, res) => {
  const { name } = req.params;
  db.query(
    "SELECT * FROM bookings WHERE customer_name = ? ORDER BY created_at DESC",
    [name],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(200).json(results);
    }
  );
});

// Get doorstep orders
router.get("/doorstep", (req, res) => {
  db.query(
    "SELECT * FROM bookings WHERE pickup_type = 'door' ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json(results);
    }
  );
});

// Get all customers
router.get("/customers", (req, res) => {
  db.query("SELECT * FROM users WHERE role = 'customer'", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(results);
  });
});

// Update booking status
router.put("/status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query(
    "UPDATE bookings SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json({ message: "Status updated successfully" });
    }
  );
});

// Accept or reject booking
router.put("/accept/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query(
    "UPDATE bookings SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json({ message: "Booking updated successfully" });
    }
  );
});

module.exports = router;