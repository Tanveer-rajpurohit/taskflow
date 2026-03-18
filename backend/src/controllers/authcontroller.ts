import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/authUtils";
import { signToken } from "../utils/authUtils";

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ success: false, message: "Email already registered" });
      return;
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed });

    const token = signToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password required" });
      return;
    }

    
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = signToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/auth/me  (verify token + return current user)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const userId = (req as any).user?.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};