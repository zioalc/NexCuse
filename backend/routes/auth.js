import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import { requireAuth } from "../middleware/requireAuth.js"

const router = express.Router()

function signToken(userId) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not set")
  }
  return jwt.sign({ sub: userId.toString() }, secret, { expiresIn: "7d" })
}

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }
    if (typeof password !== "string" || password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ error: "Email already registered" })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, passwordHash })
    const token = signToken(user._id)
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Registration failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    const token = signToken(user._id)
    res.json({
      token,
      user: { id: user._id, email: user.email },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Login failed" })
  }
})

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("email")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    const name = user.email.split("@")[0] || "Friend"
    res.json({ user: { email: user.email, name } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to load user" })
  }
})

export default router
