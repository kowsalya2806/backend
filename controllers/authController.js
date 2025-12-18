const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exisstingUser = await User.findOne({ email });
    if (exisstingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECERT_KEY,
      { expiresIn: process.env.EXPRIES_IN }
    );
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = { registerUser, loginUser };
