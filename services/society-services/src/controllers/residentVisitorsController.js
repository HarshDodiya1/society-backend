import VisitorsModel from '../models/Visitors.js';
import UnitsModel from '../models/Units.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Pre-approve a visitor
export const preApproveVisitor = async (req, res) => {
    try {
        const {
            unitId,
            memberId,
            visitorName,
            visitorPhoneNumber,
            purpose,
            visitorType,
            vehicleNumber,
            expectedArrivalDate,
            expectedArrivalTime
        } = req.body;

        if (!unitId || !memberId || !visitorName || !visitorPhoneNumber) {
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

        // Create visitor pre-approval
        const visitor = await VisitorsModel.create({
            unitId,
            memberId,
            buildingId,
            visitorName,
            visitorPhoneNumber,
            purpose,
            visitorType: visitorType || 'guest',
            vehicleNumber,
            visitDate: expectedArrivalDate || new Date(),
            expectedCheckoutTime: expectedArrivalTime,
            visitorStatus: 'expected',
            createdBy: memberId
        });

        return successResponse(res, visitor, 'Visitor pre-approved successfully', 201);
    } catch (error) {
        console.error('Pre-approve visitor error:', error);
        return errorResponse(res, error.message || 'Failed to pre-approve visitor', 500);
    }
};

// Get my visitors
export const getMyVisitors = async (req, res) => {
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
            query.visitorStatus = status;
        }

        const visitors = await VisitorsModel.find(query)
            .sort({ visitDate: -1, createdAt: -1 });

        return successResponse(res, visitors, 'Visitors fetched successfully');
    } catch (error) {
        console.error('Get my visitors error:', error);
        return errorResponse(res, error.message || 'Failed to fetch visitors', 500);
    }
};

// Get today's visitors
export const getTodayVisitors = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const visitors = await VisitorsModel.find({
            unitId,
            visitDate: { $gte: todayStart, $lte: todayEnd },
            isDeleted: false
        }).sort({ createdAt: -1 });

        return successResponse(res, visitors, 'Today\'s visitors fetched successfully');
    } catch (error) {
        console.error('Get today visitors error:', error);
        return errorResponse(res, error.message || 'Failed to fetch visitors', 500);
    }
};

// Get visitor statistics
export const getVisitorStats = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        // Today's count
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayCount = await VisitorsModel.countDocuments({
            unitId,
            visitDate: { $gte: todayStart, $lte: todayEnd },
            isDeleted: false
        });

        // This week
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        const weekCount = await VisitorsModel.countDocuments({
            unitId,
            visitDate: { $gte: weekStart },
            isDeleted: false
        });

        // This month
        const monthStart = new Date();
        monthStart.setDate(1);

        const monthCount = await VisitorsModel.countDocuments({
            unitId,
            visitDate: { $gte: monthStart },
            isDeleted: false
        });

        // Currently inside
        const currentlyInside = await VisitorsModel.countDocuments({
            unitId,
            visitorStatus: 'checked_in',
            isDeleted: false
        });

        return successResponse(res, {
            todayCount,
            weekCount,
            monthCount,
            currentlyInside
        }, 'Visitor stats fetched successfully');
    } catch (error) {
        console.error('Get visitor stats error:', error);
        return errorResponse(res, error.message || 'Failed to fetch stats', 500);
    }
};

// Delete/Cancel pre-approval
export const deleteVisitorPreApproval = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await VisitorsModel.findOne({
            _id: id,
            visitorStatus: 'expected',
            isDeleted: false
        });

        if (!visitor) {
            return errorResponse(res, 'Pre-approval not found or already checked in', 404);
        }

        visitor.isDeleted = true;
        visitor.deletedAt = new Date();
        await visitor.save();

        return successResponse(res, null, 'Pre-approval cancelled successfully');
    } catch (error) {
        console.error('Delete visitor pre-approval error:', error);
        return errorResponse(res, error.message || 'Failed to cancel pre-approval', 500);
    }
};
