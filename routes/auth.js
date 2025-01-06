const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, mobile: phone });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token, user: { id: user._id, email: user.email, username: user.username, mobile: user.mobile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Google Login
router.post("/google-login", async (req, res) => {
  const { googleId, name, email } = req.body;

  try {
    let user = await User.findOne({ googleId });
    if (!user) {
      // Create a user without mobile
      user = new User({ googleId, username: name, email });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, username: user.username, mobile: user.mobile },
    });
  } catch (error) {
    console.error("Error in /google-login:", error);
    res.status(500).json({ success: false, message: "Error saving user data" });
  }
});


// Update Mobile Number
router.post("/update-mobile", async (req, res) => {
  const { userId, mobile } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.mobile = mobile; // Update mobile field
    await user.save();

    res.json({ success: true, message: "Mobile number updated successfully" });
  } catch (error) {
    console.error("Error in /update-mobile:", error);
    res.status(500).json({ success: false, message: "Error updating mobile number" });
  }
});

module.exports = router;