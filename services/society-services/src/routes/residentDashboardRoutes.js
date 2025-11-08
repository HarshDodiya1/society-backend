import express from 'express';
import {
    getResidentDashboard,
    getQuickStats
} from '../controllers/residentDashboardController.js';

const router = express.Router();

// GET /api/resident/dashboard?unitId=xxx
router.get('/', getResidentDashboard);

// GET /api/resident/dashboard/quick-stats?unitId=xxx
router.get('/quick-stats', getQuickStats);

export default router;
