import express from 'express';
import {
    getAllBills,
    getUnitBills,
    getBillById,
    payBill,
    seedSampleBills
} from '../controllers/maintenanceController.js';

const router = express.Router();

// Admin: Get all bills
router.get('/bills', getAllBills);

// Resident: Get bills for unit
router.get('/bills/unit', getUnitBills);

// Resident: Get bill by ID
router.get('/bills/:id', getBillById);

// Resident: Pay bill
router.post('/bills/pay', payBill);

// Development: Seed sample bills (for testing)
router.post('/bills/seed', seedSampleBills);

export default router;
