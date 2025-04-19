const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register User
router.post("/register", async (req, res) => {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
    });

    const savedUser = await newUser.save();
    const { password, ...userWithoutPassword } = savedUser._doc;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Something went wrong during registration." });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json({ message: "Invalid username or password." });

    const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
      .toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password)
      return res.status(401).json({ message: "Invalid username or password." });

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...userData } = user._doc;
    res.status(200).json({ ...userData, accessToken });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed due to a server error." });
  }
});

module.exports = router;
