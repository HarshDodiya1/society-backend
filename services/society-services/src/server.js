import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Import database connection
import { DBConnect } from "./models/index.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// app.use("/api", routes);

// Root health check
app.get("/", (req, res) => {
  res.send("🚀 User Service API is running");
});

// Database connection is handled by models/index.js
// DBConnect is initialized when the module is imported

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
