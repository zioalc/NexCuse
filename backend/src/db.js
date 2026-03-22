import mongoose from "mongoose"

export async function connectDb() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from backend/.env")
  }

  try {
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("MongoDB connection failed:")
    console.error(error.message)
    throw error
  }
}