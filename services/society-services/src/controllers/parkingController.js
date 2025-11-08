import ParkingAssignmentsModel from '../models/ParkingAssignments.js';
import ParkingSpotsModel from '../models/ParkingSpots.js';
import ParkingAreasModel from '../models/ParkingAreas.js';
import VehiclesModel from '../models/Vehicles.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getParkingDashboard = async (req, res) => {
    try {
        const { buildingId } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        // Get parking areas
        const parkingAreas = await ParkingAreasModel.find({
            buildingId,
            isDeleted: false
        });

        // Get total spots by type and status
        const spotsStats = await ParkingSpotsModel.aggregate([
            {
                $lookup: {
                    from: 'parkingareas',
                    localField: 'parkingAreaId',
                    foreignField: '_id',
                    as: 'parkingArea'
                }
            },
            { $unwind: '$parkingArea' },
            { $match: { 'parkingArea.buildingId': buildingId, isDeleted: false } },
            {
                $group: {
                    _id: { type: '$parkingType', status: '$status' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get pending requests
        const pendingRequests = await ParkingAssignmentsModel.countDocuments({
            buildingId,
            assignmentStatus: 'pending',
            isDeleted: false
        });

        const dashboard = {
            parkingAreas: parkingAreas.length,
            spotsStats,
            pendingRequests,
            totalCapacity: parkingAreas.reduce((sum, area) => {
                return sum + (area.numberOfMemberCar || 0) + (area.numberOfMemberBike || 0) +
                    (area.numberOfVisitorCar || 0) + (area.numberOfVisitorBike || 0);
            }, 0)
        };

        return successResponse(res, dashboard, 'Parking dashboard fetched successfully');
    } catch (error) {
        console.error('Get parking dashboard error:', error);
        return errorResponse(res, error.message || 'Failed to fetch parking dashboard', 500);
    }
};

export const createParkingRequest = async (req, res) => {
    try {
        const { parkingSpotId, vehicleId, memberId, buildingId } = req.body;

        if (!parkingSpotId || !vehicleId || !memberId || !buildingId) {
            return errorResponse(res, 'All fields are required', 400);
        }

        // Check if spot is available
        const spot = await ParkingSpotsModel.findOne({
            _id: parkingSpotId,
            status: 'available',
            isDeleted: false
        });

        if (!spot) {
            return errorResponse(res, 'Parking spot not available', 400);
        }

        // Check if vehicle already has a parking assignment
        const existingAssignment = await ParkingAssignmentsModel.findOne({
            vehicleId,
            assignmentStatus: { $in: ['pending', 'approved'] },
            isDeleted: false
        });

        if (existingAssignment) {
            return errorResponse(res, 'Vehicle already has an active parking assignment', 400);
        }

        const newAssignment = await ParkingAssignmentsModel.create({
            parkingSpotId,
            vehicleId,
            memberId,
            buildingId,
            assignmentStatus: 'pending',
            createdBy: req.user?._id
        });

        return successResponse(res, newAssignment, 'Parking request created successfully', 201);
    } catch (error) {
        console.error('Create parking request error:', error);
        return errorResponse(res, error.message || 'Failed to create parking request', 500);
    }
};

export const getParkingRequests = async (req, res) => {
    try {
        const { buildingId, assignmentStatus } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (assignmentStatus) filter.assignmentStatus = assignmentStatus;

        const requests = await ParkingAssignmentsModel.find(filter)
            .populate('parkingSpotId', 'parkingNumber parkingType')
            .populate('vehicleId', 'vehicleNumber vehicleType')
            .populate('memberId', 'firstName lastName unitId')
            .populate('buildingId', 'buildingName')
            .sort({ createdAt: -1 });

        return successResponse(res, requests, 'Parking requests fetched successfully');
    } catch (error) {
        console.error('Get parking requests error:', error);
        return errorResponse(res, error.message || 'Failed to fetch parking requests', 500);
    }
};

export const approveParkingRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await ParkingAssignmentsModel.findOne({
            _id: id,
            isDeleted: false
        });

        if (!assignment) {
            return errorResponse(res, 'Parking request not found', 404);
        }

        if (assignment.assignmentStatus !== 'pending') {
            return errorResponse(res, 'Only pending requests can be approved', 400);
        }

        // Update assignment status
        const updatedAssignment = await ParkingAssignmentsModel.findByIdAndUpdate(
            id,
            {
                assignmentStatus: 'approved',
                approvedBy: req.user?._id,
                approvedAt: new Date(),
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        );

        // Update parking spot status to occupied
        await ParkingSpotsModel.findByIdAndUpdate(assignment.parkingSpotId, {
            status: 'occupied',
            updatedBy: req.user?._id,
            updatedAt: new Date()
        });

        return successResponse(res, updatedAssignment, 'Parking request approved successfully');
    } catch (error) {
        console.error('Approve parking request error:', error);
        return errorResponse(res, error.message || 'Failed to approve parking request', 500);
    }
};

export const rejectParkingRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await ParkingAssignmentsModel.findOne({
            _id: id,
            isDeleted: false
        });

        if (!assignment) {
            return errorResponse(res, 'Parking request not found', 404);
        }

        if (assignment.assignmentStatus !== 'pending') {
            return errorResponse(res, 'Only pending requests can be rejected', 400);
        }

        await ParkingAssignmentsModel.findByIdAndUpdate(id, {
            assignmentStatus: 'rejected',
            updatedBy: req.user?._id,
            updatedAt: new Date()
        });

        return successResponse(res, null, 'Parking request rejected successfully');
    } catch (error) {
        console.error('Reject parking request error:', error);
        return errorResponse(res, error.message || 'Failed to reject parking request', 500);
    }
};

export const releaseParkingSpot = async (req, res) => {
    try {
        const { id } = req.params;

        const assignment = await ParkingAssignmentsModel.findOne({
            _id: id,
            isDeleted: false
        });

        if (!assignment) {
            return errorResponse(res, 'Parking assignment not found', 404);
        }

        // Mark assignment as deleted
        await ParkingAssignmentsModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        // Update parking spot status to available
        await ParkingSpotsModel.findByIdAndUpdate(assignment.parkingSpotId, {
            status: 'available',
            updatedBy: req.user?._id,
            updatedAt: new Date()
        });

        return successResponse(res, null, 'Parking spot released successfully');
    } catch (error) {
        console.error('Release parking spot error:', error);
        return errorResponse(res, error.message || 'Failed to release parking spot', 500);
    }
};

export const getMemberVehicles = async (req, res) => {
    try {
        const { buildingId, memberId } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (memberId) filter.memberId = memberId;

        const vehicles = await VehiclesModel.find(filter)
            .populate('memberId', 'firstName lastName unitId')
            .sort({ createdAt: -1 });

        return successResponse(res, vehicles, 'Vehicles fetched successfully');
    } catch (error) {
        console.error('Get member vehicles error:', error);
        return errorResponse(res, error.message || 'Failed to fetch vehicles', 500);
    }
};
