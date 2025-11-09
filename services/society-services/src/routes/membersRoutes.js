import express from 'express';
import {
    getPendingMembers,
    getAllMembers,
    approveMember,
    rejectMember,
    getMemberDetails
} from '../controllers/membersController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get pending members for a building
router.get('/building/:buildingId/pending', getPendingMembers);

// Get all members for a building (with optional filters)
router.get('/building/:buildingId', getAllMembers);

// Get specific member details
router.get('/:memberId', getMemberDetails);

// Approve a member
router.post('/:memberId/approve', approveMember);

// Reject a member
router.post('/:memberId/reject', rejectMember);

export default router;
