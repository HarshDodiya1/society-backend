import NoticesModel from '../models/Notices.js';
import UnitsModel from '../models/Units.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get all published notices for resident
export const getResidentNotices = async (req, res) => {
    try {
        const { unitId, buildingId } = req.query;

        let targetBuildingId = buildingId;
        let targetBlockId = null;

        // If unitId is provided, get building and block from unit
        if (unitId) {
            const unit = await UnitsModel.findById(unitId)
                .populate({
                    path: 'floorId',
                    populate: { path: 'blockId' }
                });

            if (!unit) {
                return errorResponse(res, 'Unit not found', 404);
            }

            targetBuildingId = unit.floorId?.blockId?.buildingId;
            targetBlockId = unit.floorId?.blockId?._id;
        }

        // If neither unitId nor buildingId is provided, return error
        if (!targetBuildingId) {
            return errorResponse(res, 'Either unitId or buildingId is required', 400);
        }

        // Build query - fetch notices for the building
        const query = {
            buildingId: targetBuildingId,
            noticeStatus: 'published',
            isDeleted: false
        };

        // If we have a specific block, filter by block (or notices with no block restrictions)
        if (targetBlockId) {
            query.$or = [
                { blockIds: { $size: 0 } }, // Notices for all blocks
                { blockIds: targetBlockId } // Notices for specific block
            ];
        }

        const notices = await NoticesModel.find(query)
            .sort({ publishDate: -1 })
            .populate('createdBy', 'firstName lastName');

        console.log(`✅ Found ${notices.length} notices for building ${targetBuildingId}`);

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
