import express from 'express';
import {
    createFloors,
    getFloorsByBlock
} from '../controllers/floorController.js';
import { authenticate, isBuildingAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes - Building Admin only
router.post('/', authenticate, isBuildingAdmin, createFloors);
router.get('/:blockId', authenticate, isBuildingAdmin, getFloorsByBlock);

export default router;