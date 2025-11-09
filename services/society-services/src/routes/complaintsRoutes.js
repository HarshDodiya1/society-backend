import express from 'express';
import {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    addComplaintReply,
    addComplaintFollowUp,
    updateComplaint,
    deleteComplaint,
    getComplaintStats
} from '../controllers/complaintsController.js';

const router = express.Router();

router.post('/', createComplaint);
router.get('/', getComplaints);
router.get('/stats', getComplaintStats);
router.get('/:id', getComplaintById);
router.put('/:id', updateComplaint);
router.put('/:id/status', updateComplaintStatus);
router.post('/:id/reply', addComplaintReply);
router.post('/:id/follow-up', addComplaintFollowUp);
router.delete('/:id', deleteComplaint);

export default router;
