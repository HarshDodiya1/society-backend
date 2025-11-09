import MembersModel from '../models/Members.js';
import UsersModel from '../models/Users.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Get Pending Member Registrations for Building Admin
 * Shows all members with status='pending' for a specific building
 */
export const getPendingMembers = async (req, res) => {
    try {
        const { buildingId } = req.params;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        // Fetch pending members for this building
        const pendingMembers = await MembersModel.find({
            buildingId,
            memberStatus: 'pending',
            isDeleted: false
        })
        .populate('buildingId', 'buildingName societyName')
        .populate('blockId', 'blockName')
        .populate('floorId', 'floorName')
        .populate('unitId', 'unitNumber')
        .populate('userId', 'firstName lastName email phoneNumber countryCode')
        .sort({ createdAt: -1 }); // Most recent first

        console.log(`✅ Found ${pendingMembers.length} pending member(s) for building ${buildingId}`);

        return successResponse(res, {
            members: pendingMembers,
            count: pendingMembers.length
        }, 'Pending members fetched successfully');
    } catch (error) {
        console.error('Get Pending Members Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get All Members for Building Admin
 * Shows all members (pending, approved, rejected) for a specific building
 */
export const getAllMembers = async (req, res) => {
    try {
        const { buildingId } = req.params;
        const { status, memberType, search } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        // Build query
        const query = {
            buildingId,
            isDeleted: false
        };

        if (status) {
            query.memberStatus = status;
        }

        if (memberType) {
            query.memberType = memberType;
        }

        // Fetch members
        let membersQuery = MembersModel.find(query)
            .populate('buildingId', 'buildingName societyName')
            .populate('blockId', 'blockName')
            .populate('floorId', 'floorName')
            .populate('unitId', 'unitNumber')
            .populate('userId', 'firstName lastName email phoneNumber countryCode')
            .sort({ createdAt: -1 });

        const members = await membersQuery;

        // Apply search filter if provided
        let filteredMembers = members;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredMembers = members.filter(member => {
                const firstName = member.firstName?.toLowerCase() || '';
                const lastName = member.lastName?.toLowerCase() || '';
                const email = member.email?.toLowerCase() || '';
                const phoneNumber = member.phoneNumber || '';
                const unitNumber = member.unitId?.unitNumber?.toLowerCase() || '';
                
                return firstName.includes(searchLower) ||
                       lastName.includes(searchLower) ||
                       email.includes(searchLower) ||
                       phoneNumber.includes(search) ||
                       unitNumber.includes(searchLower);
            });
        }

        console.log(`✅ Found ${filteredMembers.length} member(s) for building ${buildingId}`);

        return successResponse(res, {
            members: filteredMembers,
            count: filteredMembers.length
        }, 'Members fetched successfully');
    } catch (error) {
        console.error('Get All Members Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Approve Member Registration
 * Building Admin approves a pending member
 */
export const approveMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const adminUser = req.user; // From auth middleware

        if (!memberId) {
            return errorResponse(res, 'Member ID is required', 400);
        }

        // Find the member
        const member = await MembersModel.findOne({
            _id: memberId,
            isDeleted: false
        });

        if (!member) {
            return errorResponse(res, 'Member not found', 404);
        }

        // Check if already approved
        if (member.memberStatus === 'approved') {
            return errorResponse(res, 'Member is already approved', 400);
        }

        // Update member status
        member.memberStatus = 'approved';
        member.approvedBy = adminUser.id;
        member.approvedAt = new Date();
        member.updatedAt = new Date();
        await member.save();

        // Update user's status
        const user = await UsersModel.findById(member.userId);
        if (user) {
            user.status = 'active';
            user.updatedAt = new Date();
            await user.save();
        }

        console.log(`✅ Member ${memberId} approved by admin ${adminUser.id}`);

        // Populate member data for response
        await member.populate('buildingId', 'buildingName societyName');
        await member.populate('blockId', 'blockName');
        await member.populate('floorId', 'floorName');
        await member.populate('unitId', 'unitNumber');
        await member.populate('userId', 'firstName lastName email phoneNumber');

        return successResponse(res, {
            member,
            message: 'Member has been approved successfully'
        }, 'Member approved successfully');
    } catch (error) {
        console.error('Approve Member Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Reject Member Registration
 * Building Admin rejects a pending member
 */
export const rejectMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { reason } = req.body;
        const adminUser = req.user; // From auth middleware

        if (!memberId) {
            return errorResponse(res, 'Member ID is required', 400);
        }

        // Find the member
        const member = await MembersModel.findOne({
            _id: memberId,
            isDeleted: false
        });

        if (!member) {
            return errorResponse(res, 'Member not found', 404);
        }

        // Check if already rejected
        if (member.memberStatus === 'rejected') {
            return errorResponse(res, 'Member is already rejected', 400);
        }

        // Update member status
        member.memberStatus = 'rejected';
        member.rejectionReason = reason || 'No reason provided';
        member.rejectedBy = adminUser.id;
        member.rejectedAt = new Date();
        member.updatedAt = new Date();
        await member.save();

        console.log(`✅ Member ${memberId} rejected by admin ${adminUser.id}`);

        // Populate member data for response
        await member.populate('buildingId', 'buildingName societyName');
        await member.populate('blockId', 'blockName');
        await member.populate('floorId', 'floorName');
        await member.populate('unitId', 'unitNumber');
        await member.populate('userId', 'firstName lastName email phoneNumber');

        return successResponse(res, {
            member,
            message: 'Member registration has been rejected'
        }, 'Member rejected successfully');
    } catch (error) {
        console.error('Reject Member Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get Member Details
 * Fetch detailed information about a specific member
 */
export const getMemberDetails = async (req, res) => {
    try {
        const { memberId } = req.params;

        if (!memberId) {
            return errorResponse(res, 'Member ID is required', 400);
        }

        const member = await MembersModel.findOne({
            _id: memberId,
            isDeleted: false
        })
        .populate('buildingId', 'buildingName societyName address city state pinCode')
        .populate('blockId', 'blockName')
        .populate('floorId', 'floorName')
        .populate('unitId', 'unitNumber bedrooms bathrooms squareFeet')
        .populate('userId', 'firstName lastName email phoneNumber countryCode gender')
        .populate('approvedBy', 'firstName lastName email')
        .populate('rejectedBy', 'firstName lastName email');

        if (!member) {
            return errorResponse(res, 'Member not found', 404);
        }

        return successResponse(res, { member }, 'Member details fetched successfully');
    } catch (error) {
        console.error('Get Member Details Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Create or Update Member (Admin assigns unit to user)
 * Creates a pre-approved member record for committee members or users
 */
export const createMember = async (req, res) => {
    try {
        const {
            userId, buildingId, blockId, floorId, unitId,
            gender, memberType, ownershipProof, committeeType
        } = req.body;

        if (!userId || !buildingId || !blockId || !floorId || !unitId || !memberType) {
            return errorResponse(res, 'Required fields missing: userId, buildingId, blockId, floorId, unitId, memberType', 400);
        }

        // Get user details
        const user = await UsersModel.findById(userId);
        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Check if user already has ANY unit allocated (prevent multiple unit allocation)
        const existingMemberAnyUnit = await MembersModel.findOne({
            userId,
            isDeleted: false
        });

        if (existingMemberAnyUnit) {
            return errorResponse(res, `This user already has a unit allocated: ${existingMemberAnyUnit.unitId}. A user can only be allocated to one unit.`, 400);
        }

        // Check if member already exists for this specific unit
        const existingMember = await MembersModel.findOne({
            userId,
            unitId,
            isDeleted: false
        });

        if (existingMember) {
            return errorResponse(res, 'Member already exists for this user and unit', 400);
        }

        // Create member with pre-approved status
        const member = await MembersModel.create({
            firstName: user.firstName,
            lastName: user.lastName,
            countryCodeName: user.countryCodeName,
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            email: user.email,
            gender: gender || 'Other',
            ownershipProof: ownershipProof || 'Admin Assigned',
            committeeType: committeeType || null,
            memberType,
            userId,
            buildingId,
            blockId,
            floorId,
            unitId,
            memberStatus: 'approved', // Pre-approved by admin
            approvedBy: req.user?._id,
            approvedAt: new Date(),
            createdBy: req.user?._id
        });

        // Update user status
        if (!user.isbuildingMember) {
            user.isbuildingMember = true;
            await user.save();
        }

        const populatedMember = await MembersModel.findById(member._id)
            .populate('buildingId', 'buildingName societyName')
            .populate('blockId', 'blockName')
            .populate('floorId', 'floorName')
            .populate('unitId', 'unitNumber')
            .populate('userId', 'firstName lastName email phoneNumber');

        return successResponse(res, populatedMember, 'Member created and approved successfully', 201);
    } catch (error) {
        console.error('Create Member Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Update Member details
 */
export const updateMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const updates = req.body;

        const member = await MembersModel.findById(memberId);
        if (!member) {
            return errorResponse(res, 'Member not found', 404);
        }

        const updatedMember = await MembersModel.findByIdAndUpdate(
            memberId,
            { ...updates, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        )
        .populate('buildingId', 'buildingName societyName')
        .populate('blockId', 'blockName')
        .populate('floorId', 'floorName')
        .populate('unitId', 'unitNumber')
        .populate('userId', 'firstName lastName email phoneNumber');

        return successResponse(res, updatedMember, 'Member updated successfully');
    } catch (error) {
        console.error('Update Member Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get all users (for admin to assign to units)
 */
export const getAllUsers = async (req, res) => {
    try {
        const { buildingId } = req.query;

        // Get all active users
        const users = await UsersModel.find({
            isDeleted: false,
            status: 'active'
        })
        .select('firstName lastName email phoneNumber countryCode isbuildingMember isbuildingEmployee')
        .sort({ createdAt: -1 });

        return successResponse(res, users, 'Users fetched successfully');
    } catch (error) {
        console.error('Get All Users Error:', error);
        return errorResponse(res, error.message, 500);
    }
};
