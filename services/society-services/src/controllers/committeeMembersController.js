import CommitteeMembersModel from '../models/CommitteeMembers.js';
import MembersModel from '../models/Members.js';
import UsersModel from '../models/Users.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createCommitteeMember = async (req, res) => {
    try {
        const {
            firstName, lastName, countryCodeName, countryCode, phoneNumber,
            email, committeeType, memberId, buildingId, startDate, endDate
        } = req.body;

        if (!firstName || !lastName || !phoneNumber || !email || !committeeType || !buildingId || !startDate) {
            return errorResponse(res, 'Required fields are missing', 400);
        }

        // Normalize country code - ensure it's always the code (e.g., "+91") not the name
        const normalizedCountryCode = countryCode && countryCode.startsWith('+') ? countryCode : '+91';
        const normalizedCountryCodeName = countryCodeName || 'IN';

        // Check if user already exists with this phone number
        let user = await UsersModel.findOne({
            phoneNumber,
            countryCode: normalizedCountryCode,
            isDeleted: false
        });

        // If user doesn't exist, create one
        if (!user) {
            user = await UsersModel.create({
                firstName,
                lastName,
                userName: `${phoneNumber}_committee`,
                countryCodeName: normalizedCountryCodeName,
                countryCode: normalizedCountryCode,
                phoneNumber,
                email,
                isbuildingMember: true,
                isbuildingEmployee: false,
                status: 'active',
                createdBy: req.user?._id
            });
        } else {
            // Update existing user to be a building member
            if (!user.isbuildingMember) {
                user.isbuildingMember = true;
                user.updatedBy = req.user?._id;
                user.updatedAt = new Date();
                await user.save();
            }
        }

        // Create committee member with userId
        const newCommitteeMember = await CommitteeMembersModel.create({
            firstName,
            lastName,
            countryCodeName: normalizedCountryCodeName,
            countryCode: normalizedCountryCode,
            phoneNumber,
            email,
            committeeType,
            userId: user._id,
            memberId,
            buildingId,
            startDate,
            endDate,
            status: 'active',
            createdBy: req.user?._id
        });

        // Populate the userId field before returning
        await newCommitteeMember.populate('userId', 'firstName lastName phoneNumber email');

        return successResponse(res, newCommitteeMember, 'Committee member added successfully and user account created', 201);
    } catch (error) {
        console.error('Create committee member error:', error);
        return errorResponse(res, error.message || 'Failed to add committee member', 500);
    }
};

export const getCommitteeMembers = async (req, res) => {
    try {
        const { buildingId, committeeType, status } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (committeeType) filter.committeeType = committeeType;
        if (status) filter.status = status;

        const committeeMembers = await CommitteeMembersModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .populate('memberId', 'firstName lastName unitId')
            .populate('userId', 'firstName lastName phoneNumber email isbuildingMember')
            .sort({ committeeType: 1, createdAt: -1 });

        return successResponse(res, committeeMembers, 'Committee members fetched successfully');
    } catch (error) {
        console.error('Get committee members error:', error);
        return errorResponse(res, error.message || 'Failed to fetch committee members', 500);
    }
};

export const getCommitteeMemberById = async (req, res) => {
    try {
        const { id } = req.params;

        const committeeMember = await CommitteeMembersModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName')
            .populate('memberId', 'firstName lastName unitId')
            .populate('userId', 'firstName lastName phoneNumber email isbuildingMember');

        if (!committeeMember) {
            return errorResponse(res, 'Committee member not found', 404);
        }

        return successResponse(res, committeeMember, 'Committee member fetched successfully');
    } catch (error) {
        console.error('Get committee member error:', error);
        return errorResponse(res, error.message || 'Failed to fetch committee member', 500);
    }
};

export const updateCommitteeMember = async (req, res) => {
    try {
        const { id } = req.params;

        const committeeMember = await CommitteeMembersModel.findOne({ _id: id, isDeleted: false });
        if (!committeeMember) {
            return errorResponse(res, 'Committee member not found', 404);
        }

        const updatedCommitteeMember = await CommitteeMembersModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedCommitteeMember, 'Committee member updated successfully');
    } catch (error) {
        console.error('Update committee member error:', error);
        return errorResponse(res, error.message || 'Failed to update committee member', 500);
    }
};

export const deleteCommitteeMember = async (req, res) => {
    try {
        const { id } = req.params;

        const committeeMember = await CommitteeMembersModel.findOne({ _id: id, isDeleted: false });
        if (!committeeMember) {
            return errorResponse(res, 'Committee member not found', 404);
        }

        await CommitteeMembersModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Committee member removed successfully');
    } catch (error) {
        console.error('Delete committee member error:', error);
        return errorResponse(res, error.message || 'Failed to remove committee member', 500);
    }
};

export const updateCommitteeMemberStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['active', 'inactive'].includes(status)) {
            return errorResponse(res, 'Valid status is required', 400);
        }

        const committeeMember = await CommitteeMembersModel.findOne({ _id: id, isDeleted: false });
        if (!committeeMember) {
            return errorResponse(res, 'Committee member not found', 404);
        }

        const updatedCommitteeMember = await CommitteeMembersModel.findByIdAndUpdate(
            id,
            { status, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedCommitteeMember, 'Status updated successfully');
    } catch (error) {
        console.error('Update committee member status error:', error);
        return errorResponse(res, error.message || 'Failed to update status', 500);
    }
};
