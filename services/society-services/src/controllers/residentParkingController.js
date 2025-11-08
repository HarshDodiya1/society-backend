import ParkingSpotsModel from '../models/ParkingSpots.js';
import ParkingRequestsModel from '../models/ParkingRequests.js';
import UnitsModel from '../models/Units.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get my parking spot
export const getMyParkingSpot = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        const parkingSpot = await ParkingSpotsModel.findOne({
            unitId,
            spotStatus: 'occupied',
            isDeleted: false
        })
            .populate('parkingAreaId', 'areaName areaType')
            .populate('unitId', 'unitNumber');

        if (!parkingSpot) {
            return successResponse(res, null, 'No parking spot assigned');
        }

        return successResponse(res, parkingSpot, 'Parking spot fetched successfully');
    } catch (error) {
        console.error('Get my parking spot error:', error);
        return errorResponse(res, error.message || 'Failed to fetch parking spot', 500);
    }
};

// Request parking spot
export const requestParkingSpot = async (req, res) => {
    try {
        const { unitId, memberId, vehicleType, vehicleNumber, requestedSpotId } = req.body;

        if (!unitId || !memberId || !vehicleType || !vehicleNumber) {
            return errorResponse(res, 'Missing required fields', 400);
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

        // Check if already has a pending request
        const existingRequest = await ParkingRequestsModel.findOne({
            unitId,
            requestStatus: 'pending',
            isDeleted: false
        });

        if (existingRequest) {
            return errorResponse(res, 'You already have a pending parking request', 400);
        }

        // Create parking request
        const request = await ParkingRequestsModel.create({
            unitId,
            memberId,
            buildingId,
            vehicleType,
            vehicleNumber,
            requestedSpotId,
            requestStatus: 'pending',
            createdBy: memberId
        });

        return successResponse(res, request, 'Parking request submitted successfully', 201);
    } catch (error) {
        console.error('Request parking spot error:', error);
        return errorResponse(res, error.message || 'Failed to submit request', 500);
    }
};

// Get my parking requests
export const getMyParkingRequests = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        const requests = await ParkingRequestsModel.find({
            unitId,
            isDeleted: false
        })
            .populate('requestedSpotId', 'spotNumber')
            .populate('assignedSpotId', 'spotNumber')
            .sort({ createdAt: -1 });

        return successResponse(res, requests, 'Parking requests fetched successfully');
    } catch (error) {
        console.error('Get parking requests error:', error);
        return errorResponse(res, error.message || 'Failed to fetch requests', 500);
    }
};

// Cancel parking request
export const cancelParkingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;

        const request = await ParkingRequestsModel.findOne({
            _id: id,
            requestStatus: 'pending',
            isDeleted: false
        });

        if (!request) {
            return errorResponse(res, 'Request not found or cannot be cancelled', 404);
        }

        request.requestStatus = 'rejected';
        request.updatedBy = memberId;
        await request.save();

        return successResponse(res, request, 'Request cancelled successfully');
    } catch (error) {
        console.error('Cancel parking request error:', error);
        return errorResponse(res, error.message || 'Failed to cancel request', 500);
    }
};
