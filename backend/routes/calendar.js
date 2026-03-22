import express from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { CalendarEntry } from "../models/CalendarEntry.js"

const router = express.Router()

router.use(requireAuth)

router.get("/", async (req, res) => {
  try {
    const rows = await CalendarEntry.find({ userId: req.userId }).lean()
    const entries = rows.map((row) => ({
      date: row.date,
      optionId: row.optionId,
      status: row.status,
    }))
    res.json({ entries })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to load calendar" })
  }
})

router.put("/:date", async (req, res) => {
  try {
    const { date } = req.params
    const { optionId, status } = req.body ?? {}
    if (typeof optionId !== "number" || typeof status !== "string") {
      return res
        .status(400)
        .json({ error: "optionId (number) and status (string) required" })
    }
    await CalendarEntry.findOneAndUpdate(
      { userId: req.userId, date },
      { userId: req.userId, date, optionId, status },
      { upsert: true, new: true },
    )
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to save entry" })
  }
})

router.delete("/:date", async (req, res) => {
  try {
    const { date } = req.params
    await CalendarEntry.deleteOne({ userId: req.userId, date })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to delete entry" })
  }
})

export default router
