import express from 'express';
import {
    createBlock,
    getBlocksBySociety,
    updateBlock,
    deleteBlock
} from '../controllers/blockController.js';
import { authenticate, isBuildingAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes - Building Admin only
router.post('/', authenticate, isBuildingAdmin, createBlock);
router.get('/society/:societyId', authenticate, isBuildingAdmin, getBlocksBySociety);
router.patch('/:id', authenticate, isBuildingAdmin, updateBlock);
router.delete('/:id', authenticate, isBuildingAdmin, deleteBlock);

export default router;