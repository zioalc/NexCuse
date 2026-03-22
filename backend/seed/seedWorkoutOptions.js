import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { connectDb } from "../src/db.js"
import { WorkoutOption } from "../models/WorkoutOption.js"
import { workoutOptions } from "./workoutOptions.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendRoot = path.join(__dirname, "..")
dotenv.config({ path: path.join(backendRoot, ".env") })

async function run() {
  await connectDb()

  const removed = await WorkoutOption.deleteMany({})
  console.log(`Removed ${removed.deletedCount} existing workout option(s).`)

  await WorkoutOption.insertMany(workoutOptions)

  const count = await WorkoutOption.countDocuments()
  console.log(`Inserted ${workoutOptions.length} workout option(s). Total in DB: ${count}.`)

  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
