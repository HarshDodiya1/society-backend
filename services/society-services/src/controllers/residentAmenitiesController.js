import AmenitiesModel from '../models/Amenities.js';
import AmenitySlotsModel from '../models/AmenitySlots.js';
import AmenityBookingsModel from '../models/AmenityBookings.js';
import UnitsModel from '../models/Units.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all active amenities
export const getResidentAmenities = async (req, res) => {
    try {
        const { buildingId } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        const amenities = await AmenitiesModel.find({
            buildingId,
            status: 'active',
            isDeleted: false
        }).select('-images');

        return successResponse(res, amenities, 'Amenities fetched successfully');
    } catch (error) {
        console.error('Get amenities error:', error);
        return errorResponse(res, error.message || 'Failed to fetch amenities', 500);
    }
};

// Get amenity details with available slots
export const getAmenityDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        const amenity = await AmenitiesModel.findOne({
            _id: id,
            status: 'active',
            isDeleted: false
        });

        if (!amenity) {
            return errorResponse(res, 'Amenity not found', 404);
        }

        // Get slots for the date if provided
        let slots = [];
        if (date) {
            slots = await AmenitySlotsModel.find({
                amenityId: id,
                slotDate: new Date(date),
                slotStatus: { $in: ['available', 'booked'] },
                isDeleted: false
            }).populate('memberId', 'firstName lastName')
                .populate('unitId', 'unitNumber');
        }

        return successResponse(res, {
            amenity,
            slots
        }, 'Amenity details fetched successfully');
    } catch (error) {
        console.error('Get amenity details error:', error);
        return errorResponse(res, error.message || 'Failed to fetch amenity details', 500);
    }
};

// Get available slots for a date
export const getAvailableSlots = async (req, res) => {
    try {
        const { amenityId } = req.params;
        const { date } = req.query;

        if (!date) {
            return errorResponse(res, 'Date is required', 400);
        }

        const slots = await AmenitySlotsModel.find({
            amenityId,
            slotDate: new Date(date),
            slotStatus: 'available',
            isDeleted: false
        }).sort({ startTime: 1 });

        return successResponse(res, slots, 'Available slots fetched successfully');
    } catch (error) {
        console.error('Get available slots error:', error);
        return errorResponse(res, error.message || 'Failed to fetch slots', 500);
    }
};

// Book an amenity slot
export const bookAmenitySlot = async (req, res) => {
    try {
        const { amenityId, slotId, memberId, unitId, notes } = req.body;

        // Validate inputs
        if (!amenityId || !slotId || !memberId || !unitId) {
            return errorResponse(res, 'Missing required fields', 400);
        }

        // Check if slot is available
        const slot = await AmenitySlotsModel.findOne({
            _id: slotId,
            amenityId,
            slotStatus: 'available',
            isDeleted: false
        });

        if (!slot) {
            return errorResponse(res, 'Slot not available', 400);
        }

        // Get amenity for price
        const amenity = await AmenitiesModel.findById(amenityId);
        if (!amenity) {
            return errorResponse(res, 'Amenity not found', 404);
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

        // Create booking
        const booking = await AmenityBookingsModel.create({
            amenityId,
            amenityBookingSlotId: slotId,
            memberId,
            unitId,
            buildingId,
            bookingDate: slot.slotDate,
            bookingAmount: amenity.pricePerSlot || 0,
            paymentStatus: amenity.pricePerSlot > 0 ? 'pending' : 'paid',
            bookingStatus: 'confirmed',
            createdBy: memberId
        });

        // Update slot status
        await AmenitySlotsModel.findByIdAndUpdate(slotId, {
            slotStatus: 'booked',
            memberId,
            unitId,
            updatedBy: memberId
        });

        return successResponse(res, booking, 'Amenity booked successfully', 201);
    } catch (error) {
        console.error('Book amenity error:', error);
        return errorResponse(res, error.message || 'Failed to book amenity', 500);
    }
};

// Get my bookings
export const getMyBookings = async (req, res) => {
    try {
        const { unitId, status } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        const query = {
            unitId,
            isDeleted: false
        };

        if (status) {
            query.bookingStatus = status;
        }

        const bookings = await AmenityBookingsModel.find(query)
            .populate('amenityId', 'amenityName amenityType location')
            .populate('amenityBookingSlotId', 'slotDate startTime endTime')
            .sort({ bookingDate: -1 });

        return successResponse(res, bookings, 'Bookings fetched successfully');
    } catch (error) {
        console.error('Get my bookings error:', error);
        return errorResponse(res, error.message || 'Failed to fetch bookings', 500);
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancellationReason, memberId } = req.body;

        const booking = await AmenityBookingsModel.findOne({
            _id: id,
            bookingStatus: { $in: ['pending', 'confirmed'] },
            isDeleted: false
        });

        if (!booking) {
            return errorResponse(res, 'Booking not found or cannot be cancelled', 404);
        }

        // Check if booking date is in the future
        if (new Date(booking.bookingDate) < new Date()) {
            return errorResponse(res, 'Cannot cancel past bookings', 400);
        }

        // Update booking
        booking.bookingStatus = 'cancelled';
        booking.cancellationReason = cancellationReason;
        booking.cancelledAt = new Date();
        booking.cancelledBy = memberId;
        booking.updatedBy = memberId;
        await booking.save();

        // Release the slot
        await AmenitySlotsModel.findByIdAndUpdate(booking.amenityBookingSlotId, {
            slotStatus: 'available',
            memberId: null,
            unitId: null,
            updatedBy: memberId
        });

        return successResponse(res, booking, 'Booking cancelled successfully');
    } catch (error) {
        console.error('Cancel booking error:', error);
        return errorResponse(res, error.message || 'Failed to cancel booking', 500);
    }
};
