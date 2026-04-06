import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/authModel.js";

const JWT_SECRET = "your_secret_key";

// 🔹 Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(name, email, hashedPassword);

    return res.json({ message: "User registered successfully ✅" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Registration failed" });
  }
};

// 🔹 Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ ONLY ONE RESPONSE
    return res.json({
      message: "Login successful 🚀",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login failed" });
  }
};