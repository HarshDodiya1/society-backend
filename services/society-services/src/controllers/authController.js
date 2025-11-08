import { successResponse, errorResponse } from '../utils/response.js';
import { generateToken } from '../utils/tokenHelper.js';
import { SUPER_ADMIN, USER_TYPES } from '../utils/constants.js';
import BuildingAdminModel from '../models/BuildingAdmins.js';
import BuildingsModel from '../models/Buildings.js';

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

        // In production, send OTP via SMS service
        console.log(`OTP for Super Admin ${phoneNumber}: ${otp}`);

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

        // In production, send OTP via SMS service
        console.log(`OTP for Building Admin ${phoneNumber}: ${otp}`);

        return successResponse(res, null, 'OTP sent successfully');
    } catch (error) {
        console.error('Building Admin Send OTP Error:', error);
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