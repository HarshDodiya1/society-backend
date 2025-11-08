import express from 'express';
import {
    createVisitor,
    getVisitors,
    getTodaysVisitors,
    getVisitorById,
    approveVisitor,
    rejectVisitor,
    checkOutVisitor,
    getVisitorStats,
    updateVisitor,
    deleteVisitor
} from '../controllers/visitorsController.js';

const router = express.Router();

router.post('/', createVisitor);
router.get('/', getVisitors);
router.get('/today', getTodaysVisitors);
router.get('/stats', getVisitorStats);
router.get('/:id', getVisitorById);
router.put('/:id', updateVisitor);
router.put('/:id/approve', approveVisitor);
router.put('/:id/reject', rejectVisitor);
router.put('/:id/checkout', checkOutVisitor);
router.delete('/:id', deleteVisitor);

export default router;
