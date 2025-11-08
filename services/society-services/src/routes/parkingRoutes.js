import express from 'express';
import {
    getParkingDashboard,
    createParkingRequest,
    getParkingRequests,
    approveParkingRequest,
    rejectParkingRequest,
    releaseParkingSpot,
    getMemberVehicles
} from '../controllers/parkingController.js';

const router = express.Router();

router.get('/dashboard', getParkingDashboard);
router.get('/requests', getParkingRequests);
router.post('/requests', createParkingRequest);
router.put('/requests/:id/approve', approveParkingRequest);
router.put('/requests/:id/reject', rejectParkingRequest);
router.put('/requests/:id/release', releaseParkingSpot);
router.get('/vehicles', getMemberVehicles);

export default router;
