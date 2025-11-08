import express from 'express';
import {
    getMyParkingSpot,
    requestParkingSpot,
    getMyParkingRequests,
    cancelParkingRequest
} from '../controllers/residentParkingController.js';

const router = express.Router();

// GET /api/resident/parking/my-spot?unitId=xxx
router.get('/my-spot', getMyParkingSpot);

// POST /api/resident/parking/request
router.post('/request', requestParkingSpot);

// GET /api/resident/parking/requests?unitId=xxx
router.get('/requests', getMyParkingRequests);

// DELETE /api/resident/parking/requests/:id/cancel
router.delete('/requests/:id/cancel', cancelParkingRequest);

export default router;
