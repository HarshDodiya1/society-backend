import express from 'express';
import authRoutes from './authRoutes.js';
import buildingRoutes from './buildingRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/buildings', buildingRoutes);

export default router;