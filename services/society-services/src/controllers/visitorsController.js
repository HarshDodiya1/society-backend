import VisitorsModel from '../models/Visitors.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createVisitor = async (req, res) => {
    try {
        const {
            visitorName, phoneNumber, visitorImage, vehicleNumber, visitorType,
            purpose, buildingId, blockId, floorId, unitId, memberId
        } = req.body;

        if (!visitorName || !phoneNumber || !purpose || !buildingId) {
            return errorResponse(res, 'Required fields are missing', 400);
        }

        const newVisitor = await VisitorsModel.create({
            visitorName,
            phoneNumber,
            visitorImage,
            vehicleNumber,
            visitorType: visitorType || 'member',
            purpose,
            buildingId,
            blockId,
            floorId,
            unitId,
            memberId,
            checkInTime: new Date(),
            approvalStatus: 'pending',
            createdBy: req.user?._id,
            status: 'active'
        });

        return successResponse(res, newVisitor, 'Visitor entry created successfully', 201);
    } catch (error) {
        console.error('Create visitor error:', error);
        return errorResponse(res, error.message || 'Failed to create visitor entry', 500);
    }
};

export const getVisitors = async (req, res) => {
    try {
        const { buildingId, visitorType, approvalStatus, startDate, endDate } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (visitorType) filter.visitorType = visitorType;
        if (approvalStatus) filter.approvalStatus = approvalStatus;

        if (startDate && endDate) {
            filter.checkInTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const visitors = await VisitorsModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .populate('blockId', 'blockName')
            .populate('floorId', 'floorName')
            .populate('unitId', 'unitNumber')
            .populate('memberId', 'firstName lastName')
            .sort({ checkInTime: -1 });

        return successResponse(res, visitors, 'Visitors fetched successfully');
    } catch (error) {
        console.error('Get visitors error:', error);
        return errorResponse(res, error.message || 'Failed to fetch visitors', 500);
    }
};

export const getTodaysVisitors = async (req, res) => {
    try {
        const { buildingId } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const visitors = await VisitorsModel.find({
            buildingId,
            checkInTime: { $gte: today, $lt: tomorrow },
            isDeleted: false
        })
            .populate('unitId', 'unitNumber')
            .populate('memberId', 'firstName lastName')
            .sort({ checkInTime: -1 });

        return successResponse(res, visitors, 'Today\'s visitors fetched successfully');
    } catch (error) {
        console.error('Get today\'s visitors error:', error);
        return errorResponse(res, error.message || 'Failed to fetch today\'s visitors', 500);
    }
};

export const getVisitorById = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await VisitorsModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName')
            .populate('blockId', 'blockName')
            .populate('floorId', 'floorName')
            .populate('unitId', 'unitNumber')
            .populate('memberId', 'firstName lastName phoneNumber');

        if (!visitor) {
            return errorResponse(res, 'Visitor not found', 404);
        }

        return successResponse(res, visitor, 'Visitor fetched successfully');
    } catch (error) {
        console.error('Get visitor error:', error);
        return errorResponse(res, error.message || 'Failed to fetch visitor', 500);
    }
};

export const approveVisitor = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await VisitorsModel.findOne({ _id: id, isDeleted: false });
        if (!visitor) {
            return errorResponse(res, 'Visitor not found', 404);
        }

        if (visitor.approvalStatus !== 'pending') {
            return errorResponse(res, 'Only pending visitors can be approved', 400);
        }

        const updatedVisitor = await VisitorsModel.findByIdAndUpdate(
            id,
            {
                approvalStatus: 'approved',
                approvedBy: req.user?._id,
                approvedAt: new Date(),
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        );

        return successResponse(res, updatedVisitor, 'Visitor approved successfully');
    } catch (error) {
        console.error('Approve visitor error:', error);
        return errorResponse(res, error.message || 'Failed to approve visitor', 500);
    }
};

export const rejectVisitor = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await VisitorsModel.findOne({ _id: id, isDeleted: false });
        if (!visitor) {
            return errorResponse(res, 'Visitor not found', 404);
        }

        if (visitor.approvalStatus !== 'pending') {
            return errorResponse(res, 'Only pending visitors can be rejected', 400);
        }

        const updatedVisitor = await VisitorsModel.findByIdAndUpdate(
            id,
            {
                approvalStatus: 'rejected',
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        );

        return successResponse(res, updatedVisitor, 'Visitor rejected successfully');
    } catch (error) {
        console.error('Reject visitor error:', error);
        return errorResponse(res, error.message || 'Failed to reject visitor', 500);
    }
};

export const checkOutVisitor = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await VisitorsModel.findOne({ _id: id, isDeleted: false });
        if (!visitor) {
            return errorResponse(res, 'Visitor not found', 404);
        }

        if (visitor.checkOutTime) {
            return errorResponse(res, 'Visitor already checked out', 400);
        }

        const updatedVisitor = await VisitorsModel.findByIdAndUpdate(
            id,
            {
                checkOutTime: new Date(),
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        );

        return successResponse(res, updatedVisitor, 'Visitor checked out successfully');
    } catch (error) {
        console.error('Check out visitor error:', error);
        return errorResponse(res, error.message || 'Failed to check out visitor', 500);
    }
};

export const getVisitorStats = async (req, res) => {
    try {
        const { buildingId, startDate, endDate } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        const filter = { buildingId, isDeleted: false };

        if (startDate && endDate) {
            filter.checkInTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const stats = await VisitorsModel.aggregate([
            { $match: filter },
            { $group: { _id: '$visitorType', count: { $sum: 1 } } }
        ]);

        const statsObj = {
            total: 0,
            employee: 0,
            member: 0,
            tenant: 0,
            vendor: 0,
            delivery: 0
        };

        stats.forEach(stat => {
            statsObj[stat._id] = stat.count;
            statsObj.total += stat.count;
        });

        return successResponse(res, statsObj, 'Visitor stats fetched successfully');
    } catch (error) {
        console.error('Get visitor stats error:', error);
        return errorResponse(res, error.message || 'Failed to fetch visitor stats', 500);
    }
};

export const updateVisitor = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await VisitorsModel.findOne({ _id: id, isDeleted: false });
        if (!visitor) {
            return errorResponse(res, 'Visitor not found', 404);
        }

        const updatedVisitor = await VisitorsModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedVisitor, 'Visitor updated successfully');
    } catch (error) {
        console.error('Update visitor error:', error);
        return errorResponse(res, error.message || 'Failed to update visitor', 500);
    }
};

export const deleteVisitor = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await VisitorsModel.findOne({ _id: id, isDeleted: false });
        if (!visitor) {
            return errorResponse(res, 'Visitor not found', 404);
        }

        await VisitorsModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Visitor deleted successfully');
    } catch (error) {
        console.error('Delete visitor error:', error);
        return errorResponse(res, error.message || 'Failed to delete visitor', 500);
    }
};
