import express from 'express';
import authRoutes from './authRoutes.js';
import buildingRoutes from './buildingRoutes.js';
import blockRoutes from './blockRoutes.js';
import floorRoutes from './floorRoutes.js';
import unitRoutes from './unitRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/buildings', buildingRoutes);
router.use('/blocks', blockRoutes);
router.use('/floors', floorRoutes);
router.use('/units', unitRoutes);

export default router;