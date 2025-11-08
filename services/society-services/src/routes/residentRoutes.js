import express from 'express';
import residentDashboardRoutes from './residentDashboardRoutes.js';
import residentNoticesRoutes from './residentNoticesRoutes.js';
import residentAmenitiesRoutes from './residentAmenitiesRoutes.js';
import residentEventsRoutes from './residentEventsRoutes.js';
import residentMaintenanceRoutes from './residentMaintenanceRoutes.js';
import residentParkingRoutes from './residentParkingRoutes.js';
import residentVisitorsRoutes from './residentVisitorsRoutes.js';

const router = express.Router();

// Resident API Routes
router.use('/dashboard', residentDashboardRoutes);
router.use('/notices', residentNoticesRoutes);
router.use('/amenities', residentAmenitiesRoutes);
router.use('/events', residentEventsRoutes);
router.use('/maintenance', residentMaintenanceRoutes);
router.use('/parking', residentParkingRoutes);
router.use('/visitors', residentVisitorsRoutes);

export default router;
