import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Cache for DB connection to support serverless (reuse connections across invocations)
let cached = global._mongodb_conn;

if (!cached) {
  cached = global._mongodb_conn = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with caching for serverless environments
 * On serverless platforms (Vercel, Lambda), this ensures connections are reused
 * and not exhausted on every cold start.
 */
async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const DB_URL = process.env.DB_URL;
    const DB_NAME = process.env.DB_NAME;
    const DEFAULT_POOL = 10;
    const maxPoolSize = parseInt(process.env.ENTRYTRACKING_DB_POOLSIZE, 10) || DEFAULT_POOL;

    if (!DB_URL) {
      throw new Error("DB_URL environment variable is not set");
    }

    const dbConfig = {
      dbName: DB_NAME,
      readPreference: 'secondaryPreferred',
      maxPoolSize,
    };

    console.log(`🔌 Connecting to database: ${DB_NAME}`);
    cached.promise = mongoose
      .connect(DB_URL, dbConfig)
      .then((m) => {
        cached.conn = m.connection;
        console.log(`✅ Connected to ${DB_NAME} database.`);
        return m.connection;
      })
      .catch((error) => {
        console.error("❌ Database connection error:", error);
        cached.promise = null; // Reset promise on error to retry
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// For backward compatibility during migration: synchronous connection for non-serverless (Docker, local)
// This is used by src/server.js when running in listening mode
function connection(DB_URL, maxPoolSize = 10, DB) {
  try {
    const dbConfig = { readPreference: 'secondaryPreferred', maxPoolSize };
    const conn = mongoose.createConnection(DB_URL, dbConfig);
    conn.on('connected', () => console.log(`✅ Connected to ${DB} database.`));
    return conn;
  } catch (error) {
    console.error("❌ Database connection Error:", error);
    return;
  }
}

// Legacy DBConnect for backward compatibility (used by routes/controllers if they import it directly)
// In serverless, this will be a stub; we use connectDB() instead
const DBConnect = connection(
  process.env.DB_URL,
  parseInt(process.env.ENTRYTRACKING_DB_POOLSIZE, 10) || 10,
  process.env.DB_NAME
);

export { DBConnect, connectDB };