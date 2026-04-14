import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendEmail } from "../config/sendEmail.js"; 
import dotenv from "dotenv";

dotenv.config();

//  Register User with Email Verification
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    // Send verification email
    const verificationLink = `${process.env.CLIENT_URL}/api/auth/verify/${verificationToken}`;
    await sendEmail(
      email,
      "Verify Your Email",
      `<p>Click the link below to verify your email:</p>
       <a href="${verificationLink}">Verify Email</a>`
    );

    res.status(201).json({ message: "User registered! Check your email for verification." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    // Mark email as verified
    user.isVerified = true;
    user.verificationToken = "";
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};

//  Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
