import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Import database connection
import { DBConnect } from "./models/index.js";

// Import routes
import routes from "./routes/index.js";

const app = express();

// CORS configuration for mobile app
const corsOptions = {
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware with more details
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Query:', JSON.stringify(req.query));

  // Log response
  const oldSend = res.send;
  res.send = function(data) {
    console.log(`${new Date().toISOString()} - Response Status: ${res.statusCode}`);
    console.log('Response Data:', typeof data === 'string' ? data.substring(0, 200) : JSON.stringify(data).substring(0, 200));
    oldSend.apply(res, arguments);
  };

  next();
});

// Routes
app.use("/api", routes);

// Root health check
app.get("/", (req, res) => {
  res.send("🚀 Society Service API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));