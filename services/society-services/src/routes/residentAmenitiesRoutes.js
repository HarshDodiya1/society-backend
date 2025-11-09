import express from 'express';
import {
    getResidentAmenities,
    getAmenityDetails,
    getAvailableSlots,
    bookAmenitySlot,
    getMyBookings,
    cancelBooking,
    createSimpleBooking,
    getResidentBookings,
    completePayment
} from '../controllers/residentAmenitiesController.js';

const router = express.Router();

// GET /api/resident/amenities?buildingId=xxx
router.get('/', getResidentAmenities);

// GET /api/resident/amenities/my-bookings?userId=xxx&status=confirmed
router.get('/my-bookings', getResidentBookings);

// POST /api/resident/amenities/simple-book (Simple booking without slots)
router.post('/simple-book', createSimpleBooking);

// POST /api/resident/amenities/complete-payment
router.post('/complete-payment', completePayment);

// GET /api/resident/amenities/:id?date=2024-01-01
router.get('/:id', getAmenityDetails);

// GET /api/resident/amenities/:amenityId/slots?date=2024-01-01
router.get('/:amenityId/slots', getAvailableSlots);

// POST /api/resident/amenities/book (Slot-based booking)
router.post('/book', bookAmenitySlot);

// GET /api/resident/amenities/bookings/my-bookings?unitId=xxx&status=confirmed (Old route)
router.get('/bookings/my-bookings', getMyBookings);

// DELETE /api/resident/amenities/bookings/:id/cancel
router.delete('/bookings/:id/cancel', cancelBooking);

export default router;
