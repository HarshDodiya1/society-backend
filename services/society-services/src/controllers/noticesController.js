import NoticesModel from '../models/Notices.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createNotice = async (req, res) => {
    try {
        const {
            title,
            description,
            attachments,
            category,
            priority,
            buildingId,
            blockIds,
            targetUserType,
            unitIds,
            publishNow,
            publishDate,
            expiryDate
        } = req.body;

        if (!title || !description || !category || !priority || !buildingId) {
            return errorResponse(res, 'Required fields are missing', 400);
        }

        const noticeData = {
            title,
            description,
            attachments: attachments || [],
            category,
            priority,
            buildingId,
            blockIds: blockIds || [],
            targetUserType: targetUserType || 'all',
            unitIds: unitIds || [],
            publishNow: publishNow || false,
            publishDate: publishNow ? new Date() : publishDate,
            expiryDate,
            noticeStatus: publishNow ? 'published' : 'draft',
            createdBy: req.user?._id,
            status: 'active'
        };

        const newNotice = await NoticesModel.create(noticeData);

        return successResponse(res, newNotice, 'Notice created successfully', 201);
    } catch (error) {
        console.error('Create notice error:', error);
        return errorResponse(res, error.message || 'Failed to create notice', 500);
    }
};

export const getNotices = async (req, res) => {
    try {
        const { buildingId, noticeStatus, category, priority } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (noticeStatus) filter.noticeStatus = noticeStatus;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        const notices = await NoticesModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .populate('blockIds', 'blockName')
            .populate('unitIds', 'unitNumber')
            .populate('createdBy', 'firstName lastName')
            .sort({ publishDate: -1 });

        return successResponse(res, notices, 'Notices fetched successfully');
    } catch (error) {
        console.error('Get notices error:', error);
        return errorResponse(res, error.message || 'Failed to fetch notices', 500);
    }
};

export const getNoticeById = async (req, res) => {
    try {
        const { id } = req.params;

        const notice = await NoticesModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName')
            .populate('blockIds', 'blockName')
            .populate('unitIds', 'unitNumber')
            .populate('createdBy', 'firstName lastName');

        if (!notice) {
            return errorResponse(res, 'Notice not found', 404);
        }

        return successResponse(res, notice, 'Notice fetched successfully');
    } catch (error) {
        console.error('Get notice error:', error);
        return errorResponse(res, error.message || 'Failed to fetch notice', 500);
    }
};

export const updateNotice = async (req, res) => {
    try {
        const { id } = req.params;

        const notice = await NoticesModel.findOne({ _id: id, isDeleted: false });
        if (!notice) {
            return errorResponse(res, 'Notice not found', 404);
        }

        const updatedNotice = await NoticesModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedNotice, 'Notice updated successfully');
    } catch (error) {
        console.error('Update notice error:', error);
        return errorResponse(res, error.message || 'Failed to update notice', 500);
    }
};

export const publishNotice = async (req, res) => {
    try {
        const { id } = req.params;

        const notice = await NoticesModel.findOne({ _id: id, isDeleted: false });
        if (!notice) {
            return errorResponse(res, 'Notice not found', 404);
        }

        const updatedNotice = await NoticesModel.findByIdAndUpdate(
            id,
            {
                noticeStatus: 'published',
                publishDate: new Date(),
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        );

        return successResponse(res, updatedNotice, 'Notice published successfully');
    } catch (error) {
        console.error('Publish notice error:', error);
        return errorResponse(res, error.message || 'Failed to publish notice', 500);
    }
};

export const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;

        const notice = await NoticesModel.findOne({ _id: id, isDeleted: false });
        if (!notice) {
            return errorResponse(res, 'Notice not found', 404);
        }

        await NoticesModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Notice deleted successfully');
    } catch (error) {
        console.error('Delete notice error:', error);
        return errorResponse(res, error.message || 'Failed to delete notice', 500);
    }
};
