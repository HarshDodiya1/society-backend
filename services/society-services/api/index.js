import dotenv from "dotenv";
import serverless from "serverless-http";
import app from "../src/app.js";
import { connectDB } from "../src/models/index.js";

dotenv.config();

// Ensure DB connection is established before handling requests
let dbConnected = false;

// Initialize DB connection on first request (for Vercel/serverless)
async function ensureDbConnection(req, res, next) {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("Failed to connect to database:", error);
      return res.status(503).json({
        success: false,
        message: "Database connection failed",
      });
    }
  }
  next();
}

// Apply middleware to ensure DB connection before routes
app.use(ensureDbConnection);

// Wrap Express app with serverless-http for Vercel
export default serverless(app);
