import express from 'express';
import {
    getResidentBills,
    getBillDetails,
    payBill,
    getPaymentHistory
} from '../controllers/residentMaintenanceController.js';

const router = express.Router();

// GET /api/resident/maintenance/bills?unitId=xxx
router.get('/bills', getResidentBills);

// GET /api/resident/maintenance/bills/:id?unitId=xxx
router.get('/bills/:id', getBillDetails);

// POST /api/resident/maintenance/bills/pay
router.post('/bills/pay', payBill);

// GET /api/resident/maintenance/payment-history?unitId=xxx
router.get('/payment-history', getPaymentHistory);

export default router;
