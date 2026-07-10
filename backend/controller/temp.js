const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");
const generateToken = require("../utils/generateToken");


const register = (req, res) => {
  const { name, email, password, dob, mobile } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  UserModel.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Error encrypting password" });

      UserModel.createUser(name, email, hashedPassword, dob, mobile, (err, result) => {
        if (err) return res.status(500).json({ message: "Error saving user" });

        const token = generateToken(result.insertId, "customer");

        res.status(201).json({
          message: "User registered successfully ",
          token,
          user: {
            id: result.insertId,
            name,
            email,
            role: "customer",
          },
        });
      });
    });
  });
};


const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  UserModel.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Error checking password" });

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = generateToken(user.id, user.role);

      res.status(200).json({
        message: "Login successful ",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  });
};

module.exports = { register, login };