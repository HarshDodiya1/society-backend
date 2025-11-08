import AmenitiesModel from '../models/Amenities.js';
import AmenitySlotsModel from '../models/AmenitySlots.js';
import AmenityBookingsModel from '../models/AmenityBookings.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createAmenity = async (req, res) => {
    try {
        const {
            name, description, images, capacity, amenityType,
            bookingCharge, bookingType, paymentGateway, advanceBookingDays,
            requiresApproval, buildingId
        } = req.body;

        if (!name || !description || !capacity || !amenityType || !bookingType || !buildingId) {
            return errorResponse(res, 'Required fields are missing', 400);
        }

        const newAmenity = await AmenitiesModel.create({
            name, description,
            images: images || [],
            capacity,
            amenityType,
            bookingCharge: bookingCharge || 0,
            bookingType,
            paymentGateway: paymentGateway || 'none',
            advanceBookingDays: advanceBookingDays || 7,
            requiresApproval: requiresApproval !== false,
            buildingId,
            amenityStatus: 'available',
            createdBy: req.user?._id,
            status: 'active'
        });

        return successResponse(res, newAmenity, 'Amenity created successfully', 201);
    } catch (error) {
        console.error('Create amenity error:', error);
        return errorResponse(res, error.message || 'Failed to create amenity', 500);
    }
};

export const getAmenities = async (req, res) => {
    try {
        const { buildingId, amenityType, amenityStatus } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (amenityType) filter.amenityType = amenityType;
        if (amenityStatus) filter.amenityStatus = amenityStatus;

        const amenities = await AmenitiesModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .sort({ createdAt: -1 });

        return successResponse(res, amenities, 'Amenities fetched successfully');
    } catch (error) {
        console.error('Get amenities error:', error);
        return errorResponse(res, error.message || 'Failed to fetch amenities', 500);
    }
};

export const getAmenityById = async (req, res) => {
    try {
        const { id } = req.params;

        const amenity = await AmenitiesModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName');

        if (!amenity) {
            return errorResponse(res, 'Amenity not found', 404);
        }

        const slots = await AmenitySlotsModel.find({ amenityId: id, isDeleted: false });

        return successResponse(res, { amenity, slots }, 'Amenity fetched successfully');
    } catch (error) {
        console.error('Get amenity error:', error);
        return errorResponse(res, error.message || 'Failed to fetch amenity', 500);
    }
};

export const updateAmenity = async (req, res) => {
    try {
        const { id } = req.params;

        const amenity = await AmenitiesModel.findOne({ _id: id, isDeleted: false });
        if (!amenity) {
            return errorResponse(res, 'Amenity not found', 404);
        }

        const updatedAmenity = await AmenitiesModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedAmenity, 'Amenity updated successfully');
    } catch (error) {
        console.error('Update amenity error:', error);
        return errorResponse(res, error.message || 'Failed to update amenity', 500);
    }
};

export const deleteAmenity = async (req, res) => {
    try {
        const { id } = req.params;

        const amenity = await AmenitiesModel.findOne({ _id: id, isDeleted: false });
        if (!amenity) {
            return errorResponse(res, 'Amenity not found', 404);
        }

        await AmenitiesModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Amenity deleted successfully');
    } catch (error) {
        console.error('Delete amenity error:', error);
        return errorResponse(res, error.message || 'Failed to delete amenity', 500);
    }
};

export const createAmenitySlot = async (req, res) => {
    try {
        const { amenityId, startTime, endTime, slotStatus } = req.body;

        if (!amenityId || !startTime || !endTime) {
            return errorResponse(res, 'Amenity ID, start time, and end time are required', 400);
        }

        const newSlot = await AmenitySlotsModel.create({
            amenityId,
            startTime,
            endTime,
            slotStatus: slotStatus || 'available',
            createdBy: req.user?._id,
            status: 'active'
        });

        return successResponse(res, newSlot, 'Amenity slot created successfully', 201);
    } catch (error) {
        console.error('Create amenity slot error:', error);
        return errorResponse(res, error.message || 'Failed to create amenity slot', 500);
    }
};

export const getAmenitySlots = async (req, res) => {
    try {
        const { amenityId } = req.query;

        const filter = { isDeleted: false };
        if (amenityId) filter.amenityId = amenityId;

        const slots = await AmenitySlotsModel.find(filter)
            .populate('amenityId', 'name')
            .sort({ startTime: 1 });

        return successResponse(res, slots, 'Amenity slots fetched successfully');
    } catch (error) {
        console.error('Get amenity slots error:', error);
        return errorResponse(res, error.message || 'Failed to fetch amenity slots', 500);
    }
};

export const updateAmenitySlot = async (req, res) => {
    try {
        const { id } = req.params;

        const slot = await AmenitySlotsModel.findOne({ _id: id, isDeleted: false });
        if (!slot) {
            return errorResponse(res, 'Amenity slot not found', 404);
        }

        const updatedSlot = await AmenitySlotsModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedSlot, 'Amenity slot updated successfully');
    } catch (error) {
        console.error('Update amenity slot error:', error);
        return errorResponse(res, error.message || 'Failed to update amenity slot', 500);
    }
};

export const deleteAmenitySlot = async (req, res) => {
    try {
        const { id } = req.params;

        const slot = await AmenitySlotsModel.findOne({ _id: id, isDeleted: false });
        if (!slot) {
            return errorResponse(res, 'Amenity slot not found', 404);
        }

        await AmenitySlotsModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Amenity slot deleted successfully');
    } catch (error) {
        console.error('Delete amenity slot error:', error);
        return errorResponse(res, error.message || 'Failed to delete amenity slot', 500);
    }
};
