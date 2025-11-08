import express from 'express';
import {
    createBuilding,
    getAllBuildings,
    getBuildingById
} from '../controllers/buildingController.js';
import { authenticate, isSuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Protected routes - Super Admin only
router.post('/', authenticate, isSuperAdmin, createBuilding);
router.get('/', authenticate, isSuperAdmin, getAllBuildings);
router.get('/:id', authenticate, isSuperAdmin, getBuildingById);

export default router;