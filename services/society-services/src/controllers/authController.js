import { successResponse, errorResponse } from '../utils/response.js';
import { generateToken } from '../utils/tokenHelper.js';
import { SUPER_ADMIN, USER_TYPES } from '../utils/constants.js';
import BuildingAdminModel from '../models/buildingadmins.js';
import BuildingsModel from '../models/Buildings.js';
import UsersModel from '../models/Users.js';
import MembersModel from '../models/Members.js';
import CommitteeMembersModel from '../models/CommitteeMembers.js';

// Temporary OTP storage (in production, use Redis)
const otpStore = new Map();

/**
 * Super Admin - Send OTP
 */
export const superAdminSendOTP = async (req, res) => {
    try {
        const { countryCode, phoneNumber } = req.body;

        if (!countryCode || !phoneNumber) {
            return errorResponse(res, 'Country code and phone number are required', 400);
        }

        // Check if it's the super admin phone number
        if (phoneNumber !== SUPER_ADMIN.phoneNumber || countryCode !== SUPER_ADMIN.countryCode) {
            return errorResponse(res, 'Invalid super admin credentials', 401);
        }

        // Generate OTP (for now, any OTP will work)
        const otp = '123456';
        
        // Store OTP temporarily
        otpStore.set(`superadmin_${phoneNumber}`, {
            otp,
            createdAt: Date.now()
        });

        return successResponse(res, null, 'OTP sent successfully');
    } catch (error) {
        console.error('Super Admin Send OTP Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Super Admin - Verify OTP
 */
export const superAdminVerifyOTP = async (req, res) => {
    try {
        const { countryCode, phoneNumber, otp } = req.body;

        if (!countryCode || !phoneNumber || !otp) {
            return errorResponse(res, 'Country code, phone number, and OTP are required', 400);
        }

        // Check if it's the super admin phone number
        if (phoneNumber !== SUPER_ADMIN.phoneNumber || countryCode !== SUPER_ADMIN.countryCode) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // For now, accept any OTP
        // const storedData = otpStore.get(`superadmin_${phoneNumber}`);
        // if (!storedData || storedData.otp !== otp) {
        //     return errorResponse(res, 'Invalid OTP', 401);
        // }

        // Clear OTP
        otpStore.delete(`superadmin_${phoneNumber}`);

        // Generate token
        const tokenPayload = {
            phoneNumber: SUPER_ADMIN.phoneNumber,
            userType: USER_TYPES.SUPER_ADMIN,
            firstName: SUPER_ADMIN.firstName,
            lastName: SUPER_ADMIN.lastName,
            email: SUPER_ADMIN.email
        };

        const accessToken = generateToken(tokenPayload);

        const responseData = {
            accessToken,
            userType: USER_TYPES.SUPER_ADMIN,
            firstName: SUPER_ADMIN.firstName,
            lastName: SUPER_ADMIN.lastName,
            email: SUPER_ADMIN.email,
            phoneNumber: SUPER_ADMIN.phoneNumber,
            countryCode: SUPER_ADMIN.countryCode,
            userRoles: ['SuperAdmin']
        };

        return successResponse(res, { result: responseData }, 'Login successful');
    } catch (error) {
        console.error('Super Admin Verify OTP Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Building Admin - Send OTP
 */
export const buildingAdminSendOTP = async (req, res) => {
    try {
        const { countryCode, phoneNumber, buildingId } = req.body;

        if (!countryCode || !phoneNumber || !buildingId) {
            return errorResponse(res, 'Country code, phone number, and building ID are required', 400);
        }

        // Check if building exists
        const building = await BuildingsModel.findOne({
            _id: buildingId,
            isDeleted: false
        });

        if (!building) {
            return errorResponse(res, 'Building not found', 404);
        }

        // Check if building admin exists
        const buildingAdmin = await BuildingAdminModel.findOne({
            phoneNumber,
            buildingId,
            isDeleted: false,
            status: 'active'
        });

        if (!buildingAdmin) {
            return errorResponse(res, 'Building admin not found or inactive', 404);
        }

        // Generate OTP (for now, any OTP will work)
        const otp = '123456';
        
        // Store OTP temporarily
        otpStore.set(`buildingadmin_${buildingId}_${phoneNumber}`, {
            otp,
            createdAt: Date.now(),
            buildingAdminId: buildingAdmin._id
        });

        return successResponse(res, null, 'OTP sent successfully');
    } catch (error) {
        console.error('Building Admin Verify OTP Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Resident - Send OTP
 * Allows any phone number to register/login
 */
export const residentSendOTP = async (req, res) => {
    try {
        const { countryCode, phoneNumber } = req.body;

        if (!countryCode || !phoneNumber) {
            return errorResponse(res, 'Country code and phone number are required', 400);
        }

        // Generate OTP (for development, using static OTP)
        const otp = '123456';
        
        // Store OTP temporarily
        otpStore.set(`resident_${countryCode}_${phoneNumber}`, {
            otp,
            createdAt: Date.now()
        });

        console.log(`📱 OTP sent to resident: ${countryCode}${phoneNumber} - OTP: ${otp}`);

        return successResponse(res, { otpSent: true }, 'OTP sent successfully');
    } catch (error) {
        console.error('Resident Send OTP Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Resident - Verify OTP
 * Verifies OTP and returns user info or creates new user
 */
export const residentVerifyOTP = async (req, res) => {
    try {
        const { countryCode, phoneNumber, otp } = req.body;

        if (!countryCode || !phoneNumber || !otp) {
            return errorResponse(res, 'Country code, phone number, and OTP are required', 400);
        }

        // Verify OTP (for development, accept any OTP or check stored)
        // const storedData = otpStore.get(`resident_${countryCode}_${phoneNumber}`);
        // if (!storedData || storedData.otp !== otp) {
        //     return errorResponse(res, 'Invalid OTP', 401);
        // }

        // Clear OTP
        otpStore.delete(`resident_${countryCode}_${phoneNumber}`);

        // Check if user exists
        let user = await UsersModel.findOne({
            countryCode,
            phoneNumber,
            isDeleted: false
        });

        let isNewUser = false;
        let member = null;
        let committeeMember = null;

        if (!user) {
            // Create new user
            isNewUser = true;
            user = await UsersModel.create({
                firstName: 'New',
                lastName: 'User',
                userName: `user_${phoneNumber}`,
                countryCodeName: 'India', // Default, will be updated in profile
                countryCode,
                phoneNumber,
                email: `${phoneNumber}@temp.com`, // Temporary, will be updated in profile
                isbuildingMember: false,
                isbuildingEmployee: false,
                status: 'active'
            });

            console.log(`✅ New user created: ${user._id}`);
        } else {
            // Existing user - check if they have member profile
            member = await MembersModel.findOne({
                userId: user._id,
                isDeleted: false
            })
            .populate('buildingId')
            .populate('unitId')
            .populate('blockId')
            .populate('floorId');

            // Check if user is a committee member
            committeeMember = await CommitteeMembersModel.findOne({
                userId: user._id,
                isDeleted: false,
                status: 'active'
            })
            .populate('buildingId', 'buildingName societyName');

            console.log(`✅ Existing user logged in: ${user._id}`);
            if (committeeMember) {
                console.log(`✅ User is a committee member: ${committeeMember.committeeType}`);
            }
        }

        // Generate token
        const tokenPayload = {
            id: user._id,
            phoneNumber: user.phoneNumber,
            userType: USER_TYPES.RESIDENT,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            committeeType: committeeMember ? committeeMember.committeeType : null
        };

        const accessToken = generateToken(tokenPayload);

        const responseData = {
            accessToken,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                countryCodeName: user.countryCodeName,
                countryCode: user.countryCode,
                phoneNumber: user.phoneNumber,
                email: user.email,
                isbuildingMember: user.isbuildingMember,
                isbuildingEmployee: user.isbuildingEmployee,
                status: user.status
            },
            isNewUser,
            isProfileComplete: !isNewUser && user.firstName && user.lastName && user.firstName !== 'New' && user.lastName !== 'User' && user.email.indexOf('@temp.com') === -1,
            isMemberRegistered: !!member,
            memberStatus: member ? member.memberStatus : null,
            member: member ? {
                _id: member._id,
                memberType: member.memberType,
                buildingId: member.buildingId?._id,
                buildingName: member.buildingId?.buildingName,
                unitId: member.unitId?._id,
                unitNumber: member.unitId?.unitNumber,
                blockId: member.blockId?._id,
                blockName: member.blockId?.blockName,
                memberStatus: member.memberStatus
            } : null,
            isCommitteeMember: !!committeeMember,
            committeeMember: committeeMember ? {
                _id: committeeMember._id,
                committeeType: committeeMember.committeeType,
                buildingId: committeeMember.buildingId?._id,
                buildingName: committeeMember.buildingId?.buildingName,
                startDate: committeeMember.startDate,
                endDate: committeeMember.endDate,
                status: committeeMember.status
            } : null
        };

        return successResponse(res, responseData, 'Login successful');
    } catch (error) {
        console.error('Resident Verify OTP Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get Buildings List for Resident Registration
 * Public endpoint - no auth required
 */
export const getBuildingsForRegistration = async (req, res) => {
    try {
        const { search, city, state } = req.query;

        const query = {
            status: 'active',
            isDeleted: false
        };

        // Add search filters
        if (search) {
            query.$or = [
                { buildingName: { $regex: search, $options: 'i' } },
                { societyName: { $regex: search, $options: 'i' } }
            ];
        }

        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }

        if (state) {
            query.state = { $regex: state, $options: 'i' };
        }

        const buildings = await BuildingsModel.find(query)
            .select('buildingName societyName address city state pincode buildingLogo territory')
            .limit(50)
            .sort({ buildingName: 1 });

        return successResponse(res, buildings, 'Buildings fetched successfully');
    } catch (error) {
        console.error('Get Buildings Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Resident - Update Profile
 * Updates user profile information after OTP verification
 */
export const residentUpdateProfile = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, gender, profileImage } = req.body;

        if (!userId || !firstName || !lastName || !email) {
            return errorResponse(res, 'User ID, first name, last name, and email are required', 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return errorResponse(res, 'Invalid email format', 400);
        }

        // Check if user exists
        const user = await UsersModel.findById(userId);
        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Check if email is already used by another user
        const existingUserWithEmail = await UsersModel.findOne({
            email,
            _id: { $ne: userId },
            isDeleted: false
        });

        if (existingUserWithEmail) {
            return errorResponse(res, 'Email is already in use by another user', 400);
        }

        // Update user profile
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.userName = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
        
        if (gender) {
            user.gender = gender;
        }
        
        if (profileImage) {
            user.profileImage = profileImage;
        }

        user.updatedAt = new Date();
        await user.save();

        console.log(`✅ Profile updated for user: ${user._id}`);

        // Generate new token with updated info
        const tokenPayload = {
            id: user._id,
            phoneNumber: user.phoneNumber,
            userType: USER_TYPES.RESIDENT,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };

        const accessToken = generateToken(tokenPayload);

        // Check if user has member record
        const member = await MembersModel.findOne({
            userId: user._id,
            isDeleted: false
        })
        .populate('buildingId')
        .populate('unitId')
        .populate('blockId')
        .populate('floorId');

        const responseData = {
            accessToken,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                countryCodeName: user.countryCodeName,
                countryCode: user.countryCode,
                phoneNumber: user.phoneNumber,
                email: user.email,
                gender: user.gender,
                profileImage: user.profileImage,
                isbuildingMember: user.isbuildingMember,
                isbuildingEmployee: user.isbuildingEmployee,
                status: user.status
            },
            isProfileComplete: true,
            isMemberRegistered: !!member,
            memberStatus: member ? member.memberStatus : null,
            member: member ? {
                _id: member._id,
                memberType: member.memberType,
                buildingId: member.buildingId?._id,
                buildingName: member.buildingId?.buildingName,
                unitId: member.unitId?._id,
                unitNumber: member.unitId?.unitNumber,
                blockId: member.blockId?._id,
                blockName: member.blockId?.blockName,
                memberStatus: member.memberStatus
            } : null
        };

        return successResponse(res, responseData, 'Profile updated successfully');
    } catch (error) {
        console.error('Resident Update Profile Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Resident - Register as Member
 * Creates a member record linking user to a building/unit
 */
export const residentRegisterMember = async (req, res) => {
    try {
        const {
            userId,
            buildingId,
            blockId,
            floorId,
            unitId,
            memberType,
            ownershipProof,
            gender
        } = req.body;

        // Validate required fields
        if (!userId || !buildingId || !blockId || !floorId || !unitId || !memberType) {
            return errorResponse(res, 'User ID, building, block, floor, unit, and member type are required', 400);
        }

        // Validate member type
        const validMemberTypes = ['Owner', 'Tenant', 'Family Member'];
        if (!validMemberTypes.includes(memberType)) {
            return errorResponse(res, 'Invalid member type. Must be Owner, Tenant, or Family Member', 400);
        }

        // Check if user exists
        const user = await UsersModel.findById(userId);
        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Check if building exists
        const building = await BuildingsModel.findById(buildingId);
        if (!building) {
            return errorResponse(res, 'Building not found', 404);
        }

        // Check if user is already a member
        const existingMember = await MembersModel.findOne({
            userId,
            isDeleted: false
        });

        if (existingMember) {
            return errorResponse(res, 'User is already registered as a member', 400);
        }

        // Create member record
        const member = await MembersModel.create({
            firstName: user.firstName,
            lastName: user.lastName,
            countryCodeName: user.countryCodeName,
            countryCode: user.countryCode,
            phoneNumber: user.phoneNumber,
            email: user.email,
            gender: gender || 'Not Specified',
            ownershipProof: ownershipProof || 'pending_upload',
            memberType,
            userId,
            blockId,
            floorId,
            unitId,
            buildingId,
            memberStatus: 'pending', // Requires Building Admin approval
            createdBy: userId
        });

        // Update user's building member status
        user.isbuildingMember = true;
        user.updatedAt = new Date();
        await user.save();

        console.log(`✅ Member registration created: ${member._id} (Status: pending Building Admin approval)`);

        // Populate member data for response
        await member.populate('buildingId');
        await member.populate('unitId');
        await member.populate('blockId');
        await member.populate('floorId');

        // Generate token with updated info
        const tokenPayload = {
            id: user._id,
            phoneNumber: user.phoneNumber,
            userType: USER_TYPES.RESIDENT,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            memberId: member._id,
            buildingId: member.buildingId._id
        };

        const accessToken = generateToken(tokenPayload);

        const responseData = {
            accessToken,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                countryCodeName: user.countryCodeName,
                countryCode: user.countryCode,
                phoneNumber: user.phoneNumber,
                email: user.email,
                isbuildingMember: true,
                isbuildingEmployee: user.isbuildingEmployee,
                status: user.status
            },
            member: {
                _id: member._id,
                memberType: member.memberType,
                buildingId: member.buildingId._id,
                buildingName: member.buildingId.buildingName,
                societyName: member.buildingId.societyName,
                unitId: member.unitId._id,
                unitNumber: member.unitId.unitNumber,
                blockId: member.blockId._id,
                blockName: member.blockId.blockName,
                floorId: member.floorId._id,
                floorName: member.floorId.floorName,
                memberStatus: 'pending'
            },
            isMemberRegistered: true,
            memberStatus: 'pending',
            message: 'Your registration has been submitted and is pending approval from the Building Admin.'
        };

        return successResponse(res, responseData, 'Member registration submitted successfully');
    } catch (error) {
        console.error('Resident Register Member Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get Building Details with Blocks/Floors/Units
 * Helps residents select their unit during registration
 */
export const getBuildingDetails = async (req, res) => {
    try {
        const { buildingId } = req.params;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        const building = await BuildingsModel.findOne({
            _id: buildingId,
            status: 'active',
            isDeleted: false
        });

        if (!building) {
            return errorResponse(res, 'Building not found', 404);
        }

        // Import models
        const BlocksModel = (await import('../models/Blocks.js')).default;
        const FloorsModel = (await import('../models/Floors.js')).default;
        const UnitsModel = (await import('../models/Units.js')).default;

        // Get blocks for this building
        const blocks = await BlocksModel.find({
            buildingId,
            isDeleted: false
        }).sort({ blockName: 1 });

        // Get all floors and units for these blocks
        const buildingStructure = await Promise.all(
            blocks.map(async (block) => {
                const floors = await FloorsModel.find({
                    blockId: block._id,
                    isDeleted: false
                }).sort({ floorName: 1 });

                const floorsWithUnits = await Promise.all(
                    floors.map(async (floor) => {
                        const units = await UnitsModel.find({
                            floorId: floor._id,
                            isDeleted: false
                        }).sort({ unitNumber: 1 });

                        return {
                            _id: floor._id,
                            floorName: floor.floorName,
                            totalUnits: units.length,
                            units: units.map(unit => ({
                                _id: unit._id,
                                unitNumber: unit.unitNumber,
                                unitType: unit.unitType,
                                area: unit.area,
                                unitStatus: unit.unitStatus
                            }))
                        };
                    })
                );

                return {
                    _id: block._id,
                    blockName: block.blockName,
                    totalFloors: floors.length,
                    floors: floorsWithUnits
                };
            })
        );

        const responseData = {
            building: {
                _id: building._id,
                buildingName: building.buildingName,
                societyName: building.societyName,
                address: building.address,
                city: building.city,
                state: building.state,
                pincode: building.pincode,
                buildingLogo: building.buildingLogo,
                totalBlocks: buildingStructure.length
            },
            blocks: buildingStructure
        };

        return successResponse(res, responseData, 'Building details fetched successfully');
    } catch (error) {
        console.error('Get Building Details Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Building Admin - Verify OTP
 */
export const buildingAdminVerifyOTP = async (req, res) => {
    try {
        const { countryCode, phoneNumber, otp, buildingId } = req.body;

        if (!countryCode || !phoneNumber || !otp || !buildingId) {
            return errorResponse(res, 'Country code, phone number, OTP, and building ID are required', 400);
        }

        // For now, accept any OTP
        // const storedData = otpStore.get(`buildingadmin_${buildingId}_${phoneNumber}`);
        // if (!storedData || storedData.otp !== otp) {
        //     return errorResponse(res, 'Invalid OTP', 401);
        // }

        // Get building admin details
        const buildingAdmin = await BuildingAdminModel.findOne({
            phoneNumber,
            buildingId,
            isDeleted: false,
            status: 'active'
        }).populate('buildingId');

        if (!buildingAdmin) {
            return errorResponse(res, 'Building admin not found', 404);
        }

        // Update last login
        buildingAdmin.lastLoginAt = new Date();
        await buildingAdmin.save();

        // Clear OTP
        otpStore.delete(`buildingadmin_${buildingId}_${phoneNumber}`);

        // Generate token
        const tokenPayload = {
            id: buildingAdmin._id,
            phoneNumber: buildingAdmin.phoneNumber,
            buildingId: buildingAdmin.buildingId._id,
            userType: USER_TYPES.BUILDING_ADMIN,
            firstName: buildingAdmin.firstName,
            lastName: buildingAdmin.lastName,
            email: buildingAdmin.email
        };

        const accessToken = generateToken(tokenPayload);

        const responseData = {
            id: buildingAdmin._id,
            accessToken,
            userType: USER_TYPES.BUILDING_ADMIN,
            firstName: buildingAdmin.firstName,
            lastName: buildingAdmin.lastName,
            email: buildingAdmin.email,
            phoneNumber: buildingAdmin.phoneNumber,
            countryCode: buildingAdmin.countryCode,
            buildingId: buildingAdmin.buildingId._id,
            buildingName: buildingAdmin.buildingId.buildingName,
            societyName: buildingAdmin.buildingId.societyName,
            userRoles: ['BuildingAdmin']
        };

        return successResponse(res, { result: responseData }, 'Login successful');
    } catch (error) {
        console.error('Building Admin Verify OTP Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get App Constants
 * Returns dropdown options and constants for mobile app
 */
export const getAppConstants = async (req, res) => {
    try {
        const constants = {
            memberTypes: [
                { label: 'Owner', value: 'Owner' },
                { label: 'Tenant', value: 'Tenant' },
                { label: 'Family Member', value: 'Family Member' }
            ],
            genderOptions: [
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' }
            ],
            userTypes: Object.keys(USER_TYPES).map(key => ({
                label: key,
                value: USER_TYPES[key]
            }))
        };

        return successResponse(res, constants, 'App constants fetched successfully');
    } catch (error) {
        console.error('Get App Constants Error:', error);
        return errorResponse(res, error.message, 500);
    }
};