import dotenv from "dotenv";
import app from "./app.js";
import { DBConnect } from "./models/index.js";

dotenv.config();

// Server listen (for local dev and Docker deployment)
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("╔═══════════════════════════════════════════╗");
    console.log("║       Society Services API Server         ║");
    console.log("╚═══════════════════════════════════════════╝");
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Android Emulator: http://10.0.2.2:${PORT}/api`);
    console.log(`💻 Local: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("");

    // Database connection is already established via import
    // DBConnect is a connection object, not a function
    if (DBConnect && DBConnect.readyState === 1) {
        console.log("✅ Database connected successfully");
    } else {
        console.log("⏳ Database connecting...");
    }
});
