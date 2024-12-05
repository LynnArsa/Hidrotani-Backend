const { promisePool } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  // REGISTER
  async registerUser(req, res) {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(422).json({ error: "Email, password, and name are required" });
    }

    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if email already exists
      const [existingUser] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "Email is already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.query(
        'INSERT INTO User (email, password, name, phone) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, phone]
      );

      await connection.commit();

      res.status(201).json({
        message: "User created successfully!",
        email,
      });
    } catch (error) {
      console.error("Error during registration:", error);
      await connection.rollback();
      res.status(500).json({
        error: error.message || "An error occurred while registering the user.",
      });
    } finally {
      connection.release();
    }
  }

  // LOGIN
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Email and password are required" });
    }

    try {
      const [users] = await promisePool.query('SELECT * FROM User WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id_user, isAdmin: user.is_admin }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      console.log("Generated JWT Token:", token);

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id_user: user.id_user,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message || "An error occurred while logging in.",
      });
    }
  }
  

// UPDATE PROTECTED
async updateUserProfile(req, res) {
  const { name, phone, password, oldPassword } = req.body;
  const userId = req.user.userId;

  if (!name && !phone && !password) {
    return res.status(400).json({ error: 'Please provide fields to update' });
  }

  const updateFields = [];
  const updateValues = [];

  if (name) {
    updateFields.push('name');
    updateValues.push(name);
  }
  if (phone) {
    updateFields.push('phone');
    updateValues.push(phone);
  }

  if (password) {
    if (!oldPassword) {
      return res.status(400).json({ error: 'Old password is required to update password' });
    }

    try {
      const [userRows] = await promisePool.query('SELECT * FROM User WHERE id_user = ?', [userId]);
      const user = userRows[0];

      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return res.status(401).json({ error: 'Old password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      updateFields.push('password');
      updateValues.push(hashedPassword);
    } catch (error) {
      return res.status(500).json({ error: 'Error checking old password' });
    }
  }

  updateValues.push(userId);

  const sql = `UPDATE User SET ${updateFields.map(field => `${field} = ?`).join(', ')} WHERE id_user = ?`;

  try {
    const [result] = await promisePool.query(sql, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
}

}


module.exports = new AuthController();
