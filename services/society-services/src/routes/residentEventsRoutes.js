import express from 'express';
import {
    getResidentEvents,
    getEventDetails,
    registerForEvent,
    getMyRegistrations,
    cancelRegistration
} from '../controllers/residentEventsController.js';

const router = express.Router();

// GET /api/resident/events?buildingId=xxx&status=published
router.get('/', getResidentEvents);

// GET /api/resident/events/:id
router.get('/:id', getEventDetails);

// POST /api/resident/events/register
router.post('/register', registerForEvent);

// GET /api/resident/events/registrations/my-registrations?memberId=xxx
router.get('/registrations/my-registrations', getMyRegistrations);

// DELETE /api/resident/events/registrations/:id/cancel
router.delete('/registrations/:id/cancel', cancelRegistration);

export default router;
