import express from 'express';
import authRoutes from './authRoutes.js';
import buildingRoutes from './buildingRoutes.js';
import buildingSettingsRoutes from './buildingSettingsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import noticesRoutes from './noticesRoutes.js';
import amenitiesRoutes from './amenitiesRoutes.js';
import committeeMembersRoutes from './committeeMembersRoutes.js';
import employeesRoutes from './employeesRoutes.js';
import complaintsRoutes from './complaintsRoutes.js';
import parkingRoutes from './parkingRoutes.js';
import eventsRoutes from './eventsRoutes.js';
import visitorsRoutes from './visitorsRoutes.js';
import maintenanceRoutes from './maintenanceRoutes.js';
import residentRoutes from './residentRoutes.js';
import membersRoutes from './membersRoutes.js';
import devRoutes from './devRoutes.js';

const router = express.Router();

// Development Routes (Only in development mode)
router.use('/dev', devRoutes);

// Admin Routes
router.use('/auth', authRoutes);
router.use('/buildings', buildingRoutes);
router.use('/building-settings', buildingSettingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notices', noticesRoutes);
router.use('/amenities', amenitiesRoutes);
router.use('/committee-members', committeeMembersRoutes);
router.use('/employees', employeesRoutes);
router.use('/complaints', complaintsRoutes);
router.use('/parking', parkingRoutes);
router.use('/events', eventsRoutes);
router.use('/visitors', visitorsRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/members', membersRoutes);

// Resident Routes (Mobile App)
router.use('/resident', residentRoutes);

export default router;