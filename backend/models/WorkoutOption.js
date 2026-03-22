import mongoose from "mongoose"

/**
 * `id` is a stable integer for calendar entries (optionId). The rest match the app fields.
 */
const workoutOptionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
})

export const WorkoutOption = mongoose.model("WorkoutOption", workoutOptionSchema)
