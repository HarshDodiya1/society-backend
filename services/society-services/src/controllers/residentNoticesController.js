import NoticesModel from '../models/Notices.js';
import UnitsModel from '../models/Units.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all published notices for resident
export const getResidentNotices = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        // Get unit to find building and block
        const unit = await UnitsModel.findById(unitId)
            .populate({
                path: 'floorId',
                populate: { path: 'blockId' }
            });

        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        const buildingId = unit.floorId?.blockId?.buildingId;
        const blockId = unit.floorId?.blockId?._id;

        // Get notices - either for all blocks or specific block
        const notices = await NoticesModel.find({
            buildingId,
            noticeStatus: 'published',
            isDeleted: false,
            $or: [
                { blockIds: { $size: 0 } }, // All blocks
                { blockIds: blockId } // Specific block
            ]
        })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'firstName lastName');

        return successResponse(res, notices, 'Notices fetched successfully');
    } catch (error) {
        console.error('Get resident notices error:', error);
        return errorResponse(res, error.message || 'Failed to fetch notices', 500);
    }
};

// Get single notice details
export const getNoticeById = async (req, res) => {
    try {
        const { id } = req.params;

        const notice = await NoticesModel.findOne({
            _id: id,
            noticeStatus: 'published',
            isDeleted: false
        }).populate('createdBy', 'firstName lastName');

        if (!notice) {
            return errorResponse(res, 'Notice not found', 404);
        }

        return successResponse(res, notice, 'Notice fetched successfully');
    } catch (error) {
        console.error('Get notice error:', error);
        return errorResponse(res, error.message || 'Failed to fetch notice', 500);
    }
};

// Mark notice as read (optional feature)
export const markNoticeAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;

        // You can create a NoticeReads model to track this
        // For now, just return success

        return successResponse(res, { noticeId: id, markedBy: memberId }, 'Notice marked as read');
    } catch (error) {
        console.error('Mark notice as read error:', error);
        return errorResponse(res, error.message || 'Failed to mark notice', 500);
    }
};
