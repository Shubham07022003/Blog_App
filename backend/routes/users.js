const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email'],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.user.id);

    // Check if email is already taken
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    await user.update({ name, email });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Change password
router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // Validate current password
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

module.exports = router; 