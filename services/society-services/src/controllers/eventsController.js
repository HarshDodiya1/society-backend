import EventsModel from '../models/Events.js';
import EventRegistrationsModel from '../models/EventRegistrations.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createEvent = async (req, res) => {
    try {
        const {
            title, description, banner, buildingId, blockIds, floorIds, unitIds,
            targetUserTypes, territory, venue, venueLocation, eventDate, startTime,
            endTime, registrationLimit, registrationFields
        } = req.body;

        // Validate required fields
        if (!title || !description || !buildingId || !venue || !eventDate || !startTime || !endTime) {
            return errorResponse(res, 'Required fields are missing (title, description, buildingId, venue, eventDate, startTime, endTime)', 400);
        }

        // Default registration limit if not provided
        const regLimit = registrationLimit || 100;

        const eventData = {
            title,
            description,
            banner: banner || null,
            buildingId,
            blockIds: blockIds || [],
            floorIds: floorIds || [],
            unitIds: unitIds || [],
            targetUserTypes: targetUserTypes || ['owner', 'tenant'],
            territory: territory || null,
            venue,
            venueLocation: venueLocation || null,
            eventDate,
            startTime,
            endTime,
            registrationLimit: regLimit,
            registrationFields: registrationFields || [],
            registrations: [],
            eventStatus: 'draft',
            createdBy: req.user?._id,
            status: 'active'
        };

        const newEvent = await EventsModel.create(eventData);

        console.log('✅ Event created:', newEvent._id);

        return successResponse(res, newEvent, 'Event created successfully', 201);
    } catch (error) {
        console.error('Create event error:', error);
        return errorResponse(res, error.message || 'Failed to create event', 500);
    }
};

export const getEvents = async (req, res) => {
    try {
        const { buildingId, eventStatus } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (eventStatus) filter.eventStatus = eventStatus;

        const events = await EventsModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .populate('blockIds', 'blockName')
            .populate('createdBy', 'firstName lastName')
            .sort({ eventDate: -1 });

        return successResponse(res, events, 'Events fetched successfully');
    } catch (error) {
        console.error('Get events error:', error);
        return errorResponse(res, error.message || 'Failed to fetch events', 500);
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await EventsModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName')
            .populate('blockIds', 'blockName')
            .populate('floorIds', 'floorName')
            .populate('unitIds', 'unitNumber')
            .populate('createdBy', 'firstName lastName');

        if (!event) {
            return errorResponse(res, 'Event not found', 404);
        }

        // Get registrations count
        const registrationsCount = await EventRegistrationsModel.countDocuments({
            eventId: id,
            isDeleted: false
        });

        const eventData = {
            ...event.toObject(),
            registrationsCount
        };

        return successResponse(res, eventData, 'Event fetched successfully');
    } catch (error) {
        console.error('Get event error:', error);
        return errorResponse(res, error.message || 'Failed to fetch event', 500);
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await EventsModel.findOne({ _id: id, isDeleted: false });
        if (!event) {
            return errorResponse(res, 'Event not found', 404);
        }

        const updatedEvent = await EventsModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedEvent, 'Event updated successfully');
    } catch (error) {
        console.error('Update event error:', error);
        return errorResponse(res, error.message || 'Failed to update event', 500);
    }
};

export const publishEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await EventsModel.findOne({ _id: id, isDeleted: false });
        if (!event) {
            return errorResponse(res, 'Event not found', 404);
        }

        const updatedEvent = await EventsModel.findByIdAndUpdate(
            id,
            {
                eventStatus: 'published',
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        );

        return successResponse(res, updatedEvent, 'Event published successfully');
    } catch (error) {
        console.error('Publish event error:', error);
        return errorResponse(res, error.message || 'Failed to publish event', 500);
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await EventsModel.findOne({ _id: id, isDeleted: false });
        if (!event) {
            return errorResponse(res, 'Event not found', 404);
        }

        await EventsModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Event deleted successfully');
    } catch (error) {
        console.error('Delete event error:', error);
        return errorResponse(res, error.message || 'Failed to delete event', 500);
    }
};

export const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.query;

        if (!eventId) {
            return errorResponse(res, 'Event ID is required', 400);
        }

        const registrations = await EventRegistrationsModel.find({
            eventId,
            isDeleted: false
        })
            .populate('memberId', 'firstName lastName phoneNumber email')
            .populate('unitId', 'unitNumber')
            .sort({ registrationDate: -1 });

        return successResponse(res, registrations, 'Event registrations fetched successfully');
    } catch (error) {
        console.error('Get event registrations error:', error);
        return errorResponse(res, error.message || 'Failed to fetch registrations', 500);
    }
};

export const markAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['attended', 'absent'].includes(status)) {
            return errorResponse(res, 'Valid attendance status is required', 400);
        }

        const registration = await EventRegistrationsModel.findOne({
            _id: id,
            isDeleted: false
        });

        if (!registration) {
            return errorResponse(res, 'Registration not found', 404);
        }

        const updatedRegistration = await EventRegistrationsModel.findByIdAndUpdate(
            id,
            {
                'attendance.status': status,
                'attendance.checkInTime': status === 'attended' ? new Date() : registration.attendance.checkInTime,
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        );

        return successResponse(res, updatedRegistration, 'Attendance marked successfully');
    } catch (error) {
        console.error('Mark attendance error:', error);
        return errorResponse(res, error.message || 'Failed to mark attendance', 500);
    }
};

export const getEventAnalytics = async (req, res) => {
    try {
        const { eventId } = req.query;

        if (!eventId) {
            return errorResponse(res, 'Event ID is required', 400);
        }

        // Convert eventId string to ObjectId
        const mongoose = await import('mongoose');
        const eventObjectId = new mongoose.default.Types.ObjectId(eventId);

        const event = await EventsModel.findOne({ _id: eventObjectId, isDeleted: false });
        if (!event) {
            return errorResponse(res, 'Event not found', 404);
        }

        const totalRegistrations = await EventRegistrationsModel.countDocuments({
            eventId: eventObjectId,
            isDeleted: false
        });

        const attendanceStats = await EventRegistrationsModel.aggregate([
            { $match: { eventId: eventObjectId, isDeleted: false } },
            { $group: { _id: '$attendance.status', count: { $sum: 1 } } }
        ]);

        const analytics = {
            eventTitle: event.title,
            eventDate: event.eventDate,
            registrationLimit: event.registrationLimit,
            totalRegistrations,
            attendanceStats: {
                registered: attendanceStats.find(s => s._id === 'registered')?.count || 0,
                attended: attendanceStats.find(s => s._id === 'attended')?.count || 0,
                absent: attendanceStats.find(s => s._id === 'absent')?.count || 0
            },
            availableSlots: event.registrationLimit - totalRegistrations
        };

        console.log('✅ Event analytics:', analytics);

        return successResponse(res, analytics, 'Event analytics fetched successfully');
    } catch (error) {
        console.error('Get event analytics error:', error);
        return errorResponse(res, error.message || 'Failed to fetch event analytics', 500);
    }
};
