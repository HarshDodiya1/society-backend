import express from 'express';
import {
    preApproveVisitor,
    getMyVisitors,
    getTodayVisitors,
    getVisitorStats,
    deleteVisitorPreApproval
} from '../controllers/residentVisitorsController.js';

const router = express.Router();

// POST /api/resident/visitors/pre-approve
router.post('/pre-approve', preApproveVisitor);

// GET /api/resident/visitors/my-visitors?unitId=xxx&status=expected
router.get('/my-visitors', getMyVisitors);

// GET /api/resident/visitors/today?unitId=xxx
router.get('/today', getTodayVisitors);

// GET /api/resident/visitors/stats?unitId=xxx
router.get('/stats', getVisitorStats);

// DELETE /api/resident/visitors/:id
router.delete('/:id', deleteVisitorPreApproval);

export default router;
