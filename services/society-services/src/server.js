import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Import database connection
import { DBConnect } from "./models/index.js";

// Import routes
import routes from "./routes/index.js";

const app = express();

// CORS configuration - use a whitelist similar to user-services
// In dev environment we'll allow all origins for convenience, otherwise enforce whitelist based on the request host header.
const whitelist = [
  'dev-sample-services.shivalikgroup.com',
  '35.154.180.15',
  '35.154.180.15:3011',
  'localhost:11001',
  '127.0.0.1',
];

const corsOption = (req, callback) => {
  // Allow all in development (including 'dev' and 'development')
  const isDev = process.env.NODE_ENV === 'dev' || 
                process.env.NODE_ENV === 'development' || 
                !process.env.NODE_ENV;
  
  if (isDev) {
    console.log('🔓 CORS: Allowing all origins (development mode)');
    return callback(null, {
      origin: true, // Allow any origin in development
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  }

  const hostHeader = req.header('host') || req.headers.host || '';
  const allowed = whitelist.indexOf(hostHeader) !== -1;

  if (allowed) {
    console.log('✅ CORS: Request allowed from', hostHeader);
    callback(null, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  } else {
    // Deny CORS - callers will receive an error
    const err = new Error(`Not allowed by CORS : ${hostHeader}`);
    console.warn('❌ CORS blocked request from', hostHeader);
    callback(err, { origin: false });
  }
};

// Middleware
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logging middleware (without headers)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  
  // Only log body for POST/PUT/PATCH requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const logBody = { ...req.body };
    // Remove sensitive fields from logs
    delete logBody.password;
    delete logBody.token;
    console.log('Body:', JSON.stringify(logBody).substring(0, 200));
  }

  // Log response status
  const oldSend = res.send;
  res.send = function(data) {
    console.log(`${timestamp} - Response: ${res.statusCode}`);
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
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║       Society Services API Server         ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Android Emulator: http://10.0.2.2:${PORT}/api`);
  console.log(`💻 Local: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  
  // Database connection is already established via import
  // DBConnect is a connection object, not a function
  if (DBConnect && DBConnect.readyState === 1) {
    console.log('✅ Database connected successfully');
  } else {
    console.log('⏳ Database connecting...');
  }
});