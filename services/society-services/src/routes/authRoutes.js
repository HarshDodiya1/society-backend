import express from 'express';
import {
    superAdminSendOTP,
    superAdminVerifyOTP,
    buildingAdminSendOTP,
    buildingAdminVerifyOTP
} from '../controllers/authController.js';

const router = express.Router();

// Super Admin Auth
router.post('/superadmin/send-otp', superAdminSendOTP);
router.post('/superadmin/verify-otp', superAdminVerifyOTP);

// Building Admin Auth
router.post('/buildingadmin/send-otp', buildingAdminSendOTP);
router.post('/buildingadmin/verify-otp', buildingAdminVerifyOTP);

export default router;