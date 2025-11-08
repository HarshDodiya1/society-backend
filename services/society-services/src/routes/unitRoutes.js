import express from 'express';
import {
    createUnit,
    getUnitsByFloor,
    getUnitsByBlock,
    updateUnitStatus
} from '../controllers/unitController.js';
import { authenticate, isBuildingAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes - Building Admin only
router.post('/', authenticate, isBuildingAdmin, createUnit);
// Route for getting units by block (must come before /:floorId to avoid route conflicts)
router.get('/block/:blockId', authenticate, isBuildingAdmin, getUnitsByBlock);
router.get('/:floorId', authenticate, isBuildingAdmin, getUnitsByFloor);
router.patch('/:id/status', authenticate, isBuildingAdmin, updateUnitStatus);

export default router;