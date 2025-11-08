import EventsModel from '../models/Events.js';
import EventRegistrationsModel from '../models/EventRegistrations.js';
import UnitsModel from '../models/Units.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all published events
export const getResidentEvents = async (req, res) => {
    try {
        const { buildingId, status } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        const query = {
            buildingId,
            eventStatus: status || 'published',
            isDeleted: false
        };

        // Get upcoming events only
        if (!status || status === 'published') {
            query.eventDate = { $gte: new Date() };
        }

        const events = await EventsModel.find(query)
            .sort({ eventDate: 1 })
            .select('-registrationFields');

        return successResponse(res, events, 'Events fetched successfully');
    } catch (error) {
        console.error('Get events error:', error);
        return errorResponse(res, error.message || 'Failed to fetch events', 500);
    }
};

// Get event details
export const getEventDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await EventsModel.findOne({
            _id: id,
            eventStatus: { $in: ['published', 'ongoing', 'completed'] },
            isDeleted: false
        });

        if (!event) {
            return errorResponse(res, 'Event not found', 404);
        }

        // Get registration count
        const registrationCount = await EventRegistrationsModel.countDocuments({
            eventId: id,
            registrationStatus: 'registered',
            isDeleted: false
        });

        return successResponse(res, {
            ...event.toObject(),
            registrationCount,
            spotsRemaining: event.registrationLimit ? event.registrationLimit - registrationCount : null
        }, 'Event details fetched successfully');
    } catch (error) {
        console.error('Get event details error:', error);
        return errorResponse(res, error.message || 'Failed to fetch event details', 500);
    }
};

// Register for event
export const registerForEvent = async (req, res) => {
    try {
        const { eventId, memberId, unitId, registrationData } = req.body;

        if (!eventId || !memberId || !unitId) {
            return errorResponse(res, 'Missing required fields', 400);
        }

        // Check if event exists and is open for registration
        const event = await EventsModel.findOne({
            _id: eventId,
            eventStatus: { $in: ['published', 'ongoing'] },
            isDeleted: false
        });

        if (!event) {
            return errorResponse(res, 'Event not found or not open for registration', 404);
        }

        // Check if already registered
        const existingRegistration = await EventRegistrationsModel.findOne({
            eventId,
            memberId,
            registrationStatus: 'registered',
            isDeleted: false
        });

        if (existingRegistration) {
            return errorResponse(res, 'Already registered for this event', 400);
        }

        // Check registration limit
        if (event.registrationLimit) {
            const currentCount = await EventRegistrationsModel.countDocuments({
                eventId,
                registrationStatus: 'registered',
                isDeleted: false
            });

            if (currentCount >= event.registrationLimit) {
                return errorResponse(res, 'Event is full', 400);
            }
        }

        // Get unit for building ID
        const unit = await UnitsModel.findById(unitId)
            .populate({
                path: 'floorId',
                populate: { path: 'blockId' }
            });

        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        const buildingId = unit.floorId?.blockId?.buildingId;

        // Create registration
        const registration = await EventRegistrationsModel.create({
            eventId,
            memberId,
            unitId,
            buildingId,
            registrationData: registrationData || {},
            registrationStatus: 'registered',
            registeredAt: new Date(),
            createdBy: memberId
        });

        return successResponse(res, registration, 'Registered successfully', 201);
    } catch (error) {
        console.error('Register for event error:', error);
        return errorResponse(res, error.message || 'Failed to register', 500);
    }
};

// Get my registrations
export const getMyRegistrations = async (req, res) => {
    try {
        const { memberId } = req.query;

        if (!memberId) {
            return errorResponse(res, 'Member ID is required', 400);
        }

        const registrations = await EventRegistrationsModel.find({
            memberId,
            isDeleted: false
        })
            .populate('eventId', 'title eventDate startTime endTime venue eventStatus')
            .sort({ createdAt: -1 });

        return successResponse(res, registrations, 'Registrations fetched successfully');
    } catch (error) {
        console.error('Get my registrations error:', error);
        return errorResponse(res, error.message || 'Failed to fetch registrations', 500);
    }
};

// Cancel registration
export const cancelRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;

        const registration = await EventRegistrationsModel.findOne({
            _id: id,
            memberId,
            registrationStatus: 'registered',
            isDeleted: false
        });

        if (!registration) {
            return errorResponse(res, 'Registration not found', 404);
        }

        // Check if event is in the future
        const event = await EventsModel.findById(registration.eventId);
        if (new Date(event.eventDate) < new Date()) {
            return errorResponse(res, 'Cannot cancel registration for past events', 400);
        }

        registration.registrationStatus = 'cancelled';
        registration.updatedBy = memberId;
        await registration.save();

        return successResponse(res, registration, 'Registration cancelled successfully');
    } catch (error) {
        console.error('Cancel registration error:', error);
        return errorResponse(res, error.message || 'Failed to cancel registration', 500);
    }
};
