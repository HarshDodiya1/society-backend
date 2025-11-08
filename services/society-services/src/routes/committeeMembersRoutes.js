import express from 'express';
import {
    createCommitteeMember,
    getCommitteeMembers,
    getCommitteeMemberById,
    updateCommitteeMember,
    deleteCommitteeMember,
    updateCommitteeMemberStatus
} from '../controllers/committeeMembersController.js';

const router = express.Router();

router.post('/', createCommitteeMember);
router.get('/', getCommitteeMembers);
router.get('/:id', getCommitteeMemberById);
router.put('/:id', updateCommitteeMember);
router.put('/:id/status', updateCommitteeMemberStatus);
router.delete('/:id', deleteCommitteeMember);

export default router;
