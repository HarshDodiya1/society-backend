import ComplaintsModel from '../models/Complaints.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createComplaint = async (req, res) => {
    try {
        console.log('📝 Create Complaint - Request body:', JSON.stringify(req.body, null, 2));

        const {
            title, category, priority, description, images, complaintType,
            buildingId, unitId, memberId
        } = req.body;

        // Log individual fields for debugging
        console.log('Fields received:', {
            title, category, priority, description, complaintType, buildingId,
            hasImages: !!images, hasUnitId: !!unitId, hasMemberId: !!memberId
        });

        // Validate required fields
        const missingFields = [];
        if (!title) missingFields.push('title');
        if (!category) missingFields.push('category');
        if (!priority) missingFields.push('priority');
        if (!description) missingFields.push('description');
        if (!complaintType) missingFields.push('complaintType');
        if (!buildingId) missingFields.push('buildingId');

        if (missingFields.length > 0) {
            console.error('❌ Missing fields:', missingFields);
            return errorResponse(res, `Missing required fields: ${missingFields.join(', ')}`, 400);
        }

        // For unit complaints, unitId is required
        if (complaintType === 'unit' && !unitId) {
            return errorResponse(res, 'Unit ID is required for unit complaints', 400);
        }

        const complaintData = {
            title,
            category,
            priority,
            description,
            images: images || [],
            complaintType,
            buildingId,
            unitId: unitId || null,
            memberId: memberId || null,
            complaintStatus: 'open',
            followUps: [],
            createdBy: req.user?._id,
            status: 'active'
        };

        console.log('Creating complaint with data:', complaintData);

        const newComplaint = await ComplaintsModel.create(complaintData);

        console.log('✅ Complaint created:', newComplaint._id);

        return successResponse(res, newComplaint, 'Complaint created successfully', 201);
    } catch (error) {
        console.error('❌ Create complaint error:', error);
        return errorResponse(res, error.message || 'Failed to create complaint', 500);
    }
};

export const getComplaints = async (req, res) => {
    try {
        const { buildingId, complaintStatus, category, priority, memberId } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (complaintStatus) filter.complaintStatus = complaintStatus;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        if (memberId) filter.memberId = memberId;

        const complaints = await ComplaintsModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .populate('unitId', 'unitNumber')
            .populate('memberId', 'firstName lastName')
            .populate('assignedToEmployeeId', 'firstName lastName employeeType')
            .sort({ createdAt: -1 });

        return successResponse(res, complaints, 'Complaints fetched successfully');
    } catch (error) {
        console.error('Get complaints error:', error);
        return errorResponse(res, error.message || 'Failed to fetch complaints', 500);
    }
};

export const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await ComplaintsModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName')
            .populate('unitId', 'unitNumber')
            .populate('memberId', 'firstName lastName phoneNumber')
            .populate('assignedToEmployeeId', 'firstName lastName employeeType')
            .populate('followUps.updatedBy', 'firstName lastName');

        if (!complaint) {
            return errorResponse(res, 'Complaint not found', 404);
        }

        return successResponse(res, complaint, 'Complaint fetched successfully');
    } catch (error) {
        console.error('Get complaint error:', error);
        return errorResponse(res, error.message || 'Failed to fetch complaint', 500);
    }
};

export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { complaintStatus, assignedToEmployeeId } = req.body;

        if (!complaintStatus) {
            return errorResponse(res, 'Complaint status is required', 400);
        }

        const validStatuses = ['open', 'in-process', 'on-hold', 'close', 're-open', 'dismiss'];
        if (!validStatuses.includes(complaintStatus)) {
            return errorResponse(res, 'Invalid complaint status', 400);
        }

        const complaint = await ComplaintsModel.findOne({ _id: id, isDeleted: false });
        if (!complaint) {
            return errorResponse(res, 'Complaint not found', 404);
        }

        const updateData = {
            complaintStatus,
            updatedBy: req.user?._id,
            updatedAt: new Date()
        };

        if (assignedToEmployeeId) {
            updateData.assignedToEmployeeId = assignedToEmployeeId;
        }

        if (complaintStatus === 'close') {
            updateData.resolvedDate = new Date();
        }

        const updatedComplaint = await ComplaintsModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return successResponse(res, updatedComplaint, 'Complaint status updated successfully');
    } catch (error) {
        console.error('Update complaint status error:', error);
        return errorResponse(res, error.message || 'Failed to update complaint status', 500);
    }
};

export const addComplaintReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, isAdminReply } = req.body;

        if (!message) {
            return errorResponse(res, 'Message is required', 400);
        }

        const complaint = await ComplaintsModel.findOne({ _id: id, isDeleted: false });
        if (!complaint) {
            return errorResponse(res, 'Complaint not found', 404);
        }

        const reply = {
            message,
            isAdminReply: isAdminReply || false,
            createdBy: req.user?._id,
            createdAt: new Date()
        };

        const updatedComplaint = await ComplaintsModel.findByIdAndUpdate(
            id,
            {
                $push: { replies: reply },
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        )
        .populate('replies.createdBy', 'firstName lastName')
        .populate('buildingId', 'buildingName')
        .populate('unitId', 'unitNumber')
        .populate('memberId', 'firstName lastName');

        return successResponse(res, updatedComplaint, 'Reply added successfully');
    } catch (error) {
        console.error('Add complaint reply error:', error);
        return errorResponse(res, error.message || 'Failed to add reply', 500);
    }
};

export const addComplaintFollowUp = async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks, nextFollowUpDate, sendEmailNotification } = req.body;

        if (!remarks) {
            return errorResponse(res, 'Remarks are required', 400);
        }

        const complaint = await ComplaintsModel.findOne({ _id: id, isDeleted: false });
        if (!complaint) {
            return errorResponse(res, 'Complaint not found', 404);
        }

        const followUp = {
            remarks,
            nextFollowUpDate,
            sendEmailNotification: sendEmailNotification || false,
            updatedBy: req.user?._id,
            updatedAt: new Date()
        };

        const updatedComplaint = await ComplaintsModel.findByIdAndUpdate(
            id,
            {
                $push: { followUps: followUp },
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        ).populate('followUps.updatedBy', 'firstName lastName');

        return successResponse(res, updatedComplaint, 'Follow-up added successfully');
    } catch (error) {
        console.error('Add complaint follow-up error:', error);
        return errorResponse(res, error.message || 'Failed to add follow-up', 500);
    }
};

export const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await ComplaintsModel.findOne({ _id: id, isDeleted: false });
        if (!complaint) {
            return errorResponse(res, 'Complaint not found', 404);
        }

        const updatedComplaint = await ComplaintsModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedComplaint, 'Complaint updated successfully');
    } catch (error) {
        console.error('Update complaint error:', error);
        return errorResponse(res, error.message || 'Failed to update complaint', 500);
    }
};

export const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await ComplaintsModel.findOne({ _id: id, isDeleted: false });
        if (!complaint) {
            return errorResponse(res, 'Complaint not found', 404);
        }

        await ComplaintsModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Complaint deleted successfully');
    } catch (error) {
        console.error('Delete complaint error:', error);
        return errorResponse(res, error.message || 'Failed to delete complaint', 500);
    }
};

export const getComplaintStats = async (req, res) => {
    try {
        const { buildingId } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        // Convert buildingId string to ObjectId for aggregation
        const mongoose = await import('mongoose');
        const buildingObjectId = new mongoose.default.Types.ObjectId(buildingId);

        const stats = await ComplaintsModel.aggregate([
            { $match: { buildingId: buildingObjectId, isDeleted: false } },
            { $group: { _id: '$complaintStatus', count: { $sum: 1 } } }
        ]);

        const statsObj = {
            all: 0,
            open: 0,
            'in-process': 0,
            'on-hold': 0,
            close: 0,
            're-open': 0,
            dismiss: 0
        };

        stats.forEach(stat => {
            if (stat._id && statsObj.hasOwnProperty(stat._id)) {
                statsObj[stat._id] = stat.count;
            }
            statsObj.all += stat.count;
        });

        console.log('✅ Complaint stats:', statsObj);

        return successResponse(res, statsObj, 'Complaint stats fetched successfully');
    } catch (error) {
        console.error('Get complaint stats error:', error);
        return errorResponse(res, error.message || 'Failed to fetch complaint stats', 500);
    }
};
