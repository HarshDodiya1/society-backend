import express from 'express';
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    publishEvent,
    deleteEvent,
    getEventRegistrations,
    markAttendance,
    getEventAnalytics
} from '../controllers/eventsController.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.put('/:id/publish', publishEvent);
router.delete('/:id', deleteEvent);
router.get('/registrations', getEventRegistrations);
router.put('/registrations/:id/attendance', markAttendance);
router.get('/analytics', getEventAnalytics);

export default router;
