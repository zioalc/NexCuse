import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import { connectDb } from "./db.js"
import authRoutes from "../routes/auth.js"
import calendarRoutes from "../routes/calendar.js"
import optionsRoutes from "../routes/options.js"
import { isSpaRoute } from "../../shared/ValidRoutes.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendRoot = path.join(__dirname, "..")
dotenv.config({ path: path.join(backendRoot, ".env") })

const app = express()
const PORT = Number(process.env.PORT) || 3000

const staticDir = process.env.STATIC_DIR
  ? path.resolve(backendRoot, process.env.STATIC_DIR)
  : path.resolve(backendRoot, "../frontend/dist")

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/calendar", calendarRoutes)
app.use("/api/options", optionsRoutes)

// Serve static frontend
const staticExists = fs.existsSync(staticDir)
if (staticExists) {
  app.use(express.static(staticDir))
}

// ✅ FIXED SPA handler (NO "*" wildcard)
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next()
  if (req.path.startsWith("/api")) return next()

  if (!staticExists) {
    return res
      .status(404)
      .type("text")
      .send(
        "Frontend build not found. Run `npm run build` in frontend/ or set STATIC_DIR in backend/.env",
      )
  }

  // If requesting a real file (like .js, .css), return 404 if not found
  if (path.extname(req.path)) {
    return res.status(404).send("Not found")
  }

  // Serve React app for valid SPA routes
  if (isSpaRoute(req.path)) {
    return res.sendFile(path.join(staticDir, "index.html"))
  }

  return res.status(404).send("Not found")
})

// Final fallback
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" })
  }
  return res.status(404).send("Not found")
})

async function start() {
  await connectDb()
  app.listen(PORT, () => {
    console.log(`API + static (if built): http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})