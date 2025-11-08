import express from 'express';
import {
    createUnit,
    getUnitsByFloor,
    updateUnitStatus
} from '../controllers/unitController.js';
import { authenticate, isBuildingAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes - Building Admin only
router.post('/', authenticate, isBuildingAdmin, createUnit);
router.get('/:floorId', authenticate, isBuildingAdmin, getUnitsByFloor);
router.patch('/:id/status', authenticate, isBuildingAdmin, updateUnitStatus);

export default router;