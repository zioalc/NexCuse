import mongoose from "mongoose"

const calendarEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  date: { type: String, required: true },
  optionId: { type: Number, required: true },
  status: { type: String, required: true },
})

calendarEntrySchema.index({ userId: 1, date: 1 }, { unique: true })

export const CalendarEntry = mongoose.model("CalendarEntry", calendarEntrySchema)
