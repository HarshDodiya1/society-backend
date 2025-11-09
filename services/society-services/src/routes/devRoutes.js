/**
 * Development Routes
 * ⚠️ ONLY FOR DEVELOPMENT - DO NOT USE IN PRODUCTION
 */

import express from 'express';
import { cleanDatabase, getDatabaseStats, seedNotices } from '../controllers/devController.js';
import { authenticate, isSuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Middleware to check if development mode
const isDevelopmentMode = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
            success: false,
            message: 'Development routes are not available in production'
        });
    }
    next();
};

// Public dev routes (no authentication required)
router.use(isDevelopmentMode);

// Get database statistics (public in dev mode)
router.get('/db-stats', getDatabaseStats);

// Seed sample notices (public in dev mode for easy testing)
router.post('/seed-notices', seedNotices);

// Protected routes (require authentication and super admin)
router.use(authenticate);
router.use(isSuperAdmin);

// Clean entire database (DANGEROUS - requires auth)
router.delete('/clean-database', cleanDatabase);

export default router;
