import express from "express"
import { WorkoutOption } from "../models/WorkoutOption.js"

const router = express.Router()

/**
 * Support both current schema (title, category, …) and legacy seeded docs
 * (name, tag, focus, targets, exercises) so the API always returns a stable shape.
 */
function normalizeOption(doc) {
  const id = Number(doc.id)
  if (!Number.isFinite(id)) return null

  const title = doc.title ?? doc.name ?? ""
  const category = doc.category ?? doc.tag ?? ""
  const legacyBits = [doc.focus, doc.targets, doc.exercises].filter(Boolean)
  const description =
    doc.description ??
    (legacyBits.length ? legacyBits.join(" · ") : "")

  return { id, title, category, description }
}

router.get("/", async (req, res) => {
  try {
    const rows = await WorkoutOption.find().sort({ id: 1 }).lean()
    const options = rows.map(normalizeOption).filter(Boolean)

    if (process.env.NODE_ENV !== "production") {
      console.log(`[GET /api/options] ${options.length} option(s) from MongoDB`)
    }

    res.json({ options })
  } catch (err) {
    console.error("[GET /api/options]", err)
    res.status(500).json({ error: "Failed to load workout options" })
  }
})

export default router
