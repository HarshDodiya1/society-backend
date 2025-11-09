import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

// CORS configuration - use a whitelist similar to user-services
// In dev environment we'll allow all origins for convenience, otherwise enforce whitelist based on the request host header.

// Default whitelist of allowed origins
let whitelist = [
    "dev-sample-services.shivalikgroup.com",
    "35.154.180.15",
    "35.154.180.15:3011",
    "localhost:11001",
    "localhost:3000",
    "localhost:5000",
    "127.0.0.1",
    "127.0.0.1:5000",
    // "http://10.0.2.2:5000",
];

// Add environment-specific allowed origins
if (process.env.CORS_ALLOWED_ORIGINS) {
    const envOrigins = process.env.CORS_ALLOWED_ORIGINS.split(",").map(o => o.trim());
    whitelist = [...whitelist, ...envOrigins];
}

// Add support for all Vercel domains (preview & production) if not in strict mode
// This allows any vercel.app or custom domain on the same account
const isVercelDeployment = process.env.VERCEL === "1";
if (isVercelDeployment && process.env.NODE_ENV !== "development") {
    // Allow all vercel.app subdomains automatically
    whitelist.push("*.vercel.app");
}

const corsOption = (req, callback) => {
    // Allow all in development (including 'dev' and 'development', or if NODE_ENV is not set)
    const isDev =
        process.env.NODE_ENV === "dev" ||
        process.env.NODE_ENV === "development" ||
        !process.env.NODE_ENV;

    if (isDev) {
        console.log("🔓 CORS: Allowing all origins (development mode)");
        return callback(null, {
            origin: true, // Allow any origin in development
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        });
    }

    const hostHeader = req.header("host") || req.headers.host || "";
    
    // Check if origin is in whitelist (exact match or pattern match)
    let allowed = whitelist.some(origin => {
        // Support both exact matches and wildcard domain patterns
        if (origin.includes("*")) {
            const pattern = origin.replace(/\*/g, ".*");
            return new RegExp(`^${pattern}$`).test(hostHeader);
        }
        return origin === hostHeader;
    });

    if (allowed) {
        console.log("✅ CORS: Request allowed from", hostHeader);
        callback(null, {
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        });
    } else {
        // Deny CORS - callers will receive an error
        const err = new Error(`Not allowed by CORS : ${hostHeader}`);
        console.warn("❌ CORS blocked request from", hostHeader, "| Whitelist:", whitelist);
        callback(err, { origin: false });
    }
};

// Create and configure Express app
const app = express();

// Middleware
app.use(cors(corsOption));
app.use(express.json({ limit: "50mb" })); // Increased limit for large payloads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Simple request logging middleware (without headers)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);

    // Log content type
    if (req.headers["content-type"]) {
        console.log("Content-Type:", req.headers["content-type"]);
    }

    // Only log body for POST/PUT/PATCH requests (excluding sensitive data)
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
        if (req.body && Object.keys(req.body).length > 0) {
            const logBody = { ...req.body };
            // Remove sensitive fields from logs
            delete logBody.password;
            delete logBody.token;
            console.log("Body keys:", Object.keys(logBody));
            console.log(
                "Body sample:",
                JSON.stringify(logBody).substring(0, 300)
            );
        } else {
            console.warn("⚠️ Empty or missing request body");
        }
    }

    // Log response status
    const oldSend = res.send;
    res.send = function (data) {
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
        message: "Route not found",
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});

export default app;
