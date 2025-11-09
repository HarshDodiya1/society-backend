import express from 'express';
import {
    createAmenity,
    getAmenities,
    getAmenityById,
    updateAmenity,
    deleteAmenity,
    createAmenitySlot,
    getAmenitySlots,
    updateAmenitySlot,
    deleteAmenitySlot,
    getAllBookings,
    updateBookingStatus
} from '../controllers/amenitiesController.js';

const router = express.Router();

router.post('/', createAmenity);
router.get('/', getAmenities);
router.get('/:id', getAmenityById);
router.put('/:id', updateAmenity);
router.delete('/:id', deleteAmenity);

router.post('/slots', createAmenitySlot);
router.get('/slots', getAmenitySlots);
router.put('/slots/:id', updateAmenitySlot);
router.delete('/slots/:id', deleteAmenitySlot);

// Bookings management
router.get('/bookings/all', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

export default router;
