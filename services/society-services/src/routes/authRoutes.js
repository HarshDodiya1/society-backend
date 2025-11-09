import express from 'express';
import {
    superAdminSendOTP,
    superAdminVerifyOTP,
    buildingAdminSendOTP,
    buildingAdminVerifyOTP,
    residentSendOTP,
    residentVerifyOTP,
    residentUpdateProfile,
    residentRegisterMember,
    getBuildingsForRegistration,
    getBuildingDetails,
    getAppConstants
} from '../controllers/authController.js';

const router = express.Router();

// Super Admin Auth
router.post('/superadmin/send-otp', superAdminSendOTP);
router.post('/superadmin/verify-otp', superAdminVerifyOTP);

// Building Admin Auth
router.post('/buildingadmin/send-otp', buildingAdminSendOTP);
router.post('/buildingadmin/verify-otp', buildingAdminVerifyOTP);

// Resident Auth (Mobile App)
router.post('/resident/send-otp', residentSendOTP);
router.post('/resident/verify-otp', residentVerifyOTP);
router.post('/resident/update-profile', residentUpdateProfile);
router.post('/resident/register-member', residentRegisterMember);

// Public endpoints for registration
router.get('/buildings/search', getBuildingsForRegistration);
router.get('/buildings/:buildingId/details', getBuildingDetails);

// App constants (public)
router.get('/constants', getAppConstants);

export default router;