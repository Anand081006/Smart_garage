const db = require("../config/db");

const UserModel = {
  // Find user by email
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  },

  // Create new user
  createUser: (name, email, password, dob, mobile, callback) => {
    db.query(
      "INSERT INTO users (name, email, password, dob, mobile) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, dob, mobile],
      callback
    );
  },

  // Find user by id
  findById: (id, callback) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], callback);
  },
};

module.exports = UserModel;