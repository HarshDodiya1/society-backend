import express from 'express';
import {
    createMaintenanceBill,
    getMaintenanceBills,
    getMaintenanceBillById,
    updateMaintenanceBill,
    publishMaintenanceBill,
    deleteMaintenanceBill,
    getMaintenanceBillStats,
    createMaintenanceType,
    getMaintenanceTypes
} from '../controllers/maintenanceController.js';

const router = express.Router();

router.post('/bills', createMaintenanceBill);
router.get('/bills', getMaintenanceBills);
router.get('/bills/stats', getMaintenanceBillStats);
router.get('/bills/:id', getMaintenanceBillById);
router.put('/bills/:id', updateMaintenanceBill);
router.put('/bills/:id/publish', publishMaintenanceBill);
router.delete('/bills/:id', deleteMaintenanceBill);

router.post('/types', createMaintenanceType);
router.get('/types', getMaintenanceTypes);

export default router;
