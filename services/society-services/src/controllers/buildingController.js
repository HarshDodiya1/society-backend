import { successResponse, errorResponse } from '../utils/response.js';
import BuildingsModel from '../models/Buildings.js';
import BuildingAdminModel from '../models/buildingadmins.js'

/**
 * Create Building (Society)
 */
export const createBuilding = async (req, res) => {
    try {
        const {
            societyName,
            buildingName,
            territory,
            address,
            city,
            state,
            pincode,
            projectId,
            // Building Admin Details
            firstName,
            lastName,
            email,
            countryCode,
            phoneNumber
        } = req.body;

        // Validation
        if (!societyName || !buildingName || !address || !city || !state || !pincode) {
            return errorResponse(res, 'Please provide all required building details', 400);
        }

        if (!firstName || !lastName || !phoneNumber || !email) {
            return errorResponse(res, 'Please provide all required building admin details', 400);
        }

        // Check if building admin already exists
        const existingAdmin = await BuildingAdminModel.findOne({
            $or: [{ email }, { phoneNumber }],
            isDeleted: false
        });

        if (existingAdmin) {
            return errorResponse(res, 'Building admin with this email or phone already exists', 400);
        }

        // Create building (don't set createdBy for super admin)
        const building = await BuildingsModel.create({
            societyName,
            buildingName,
            territory,
            address,
            city,
            state,
            pincode,
            projectId: projectId || null,
            status: 'active',
            // Don't set createdBy for super admin since it's not an ObjectId
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Create building admin (don't set createdBy)
        const buildingAdmin = await BuildingAdminModel.create({
            firstName,
            lastName,
            email,
            countryCode: countryCode || '+91',
            phoneNumber,
            buildingId: building._id,
            status: 'active',
            // Don't set createdBy for super admin
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Generate building admin login link
        const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/${building._id}/login`;

        const responseData = {
            building: {
                id: building._id,
                societyName: building.societyName,
                buildingName: building.buildingName,
                address: building.address,
                city: building.city,
                state: building.state,
                pincode: building.pincode
            },
            buildingAdmin: {
                id: buildingAdmin._id,
                firstName: buildingAdmin.firstName,
                lastName: buildingAdmin.lastName,
                email: buildingAdmin.email,
                phoneNumber: buildingAdmin.phoneNumber
            },
            loginLink
        };

        return successResponse(res, responseData, 'Building created successfully', 201);
    } catch (error) {
        console.error('Create Building Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get All Buildings
 */
export const getAllBuildings = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;

        const query = { isDeleted: false };

        if (search) {
            query.$or = [
                { societyName: { $regex: search, $options: 'i' } },
                { buildingName: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const buildings = await BuildingsModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await BuildingsModel.countDocuments(query);

        return successResponse(res, {
            buildings,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        }, 'Buildings fetched successfully');
    } catch (error) {
        console.error('Get Buildings Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get Building By ID
 */
export const getBuildingById = async (req, res) => {
    try {
        const { id } = req.params;

        const building = await BuildingsModel.findOne({
            _id: id,
            isDeleted: false
        });

        if (!building) {
            return errorResponse(res, 'Building not found', 404);
        }

        // Get building admin
        const buildingAdmin = await BuildingAdminModel.findOne({
            buildingId: id,
            isDeleted: false
        }).select('-__v');

        return successResponse(res, {
            building,
            buildingAdmin
        }, 'Building details fetched successfully');
    } catch (error) {
        console.error('Get Building Error:', error);
        return errorResponse(res, error.message, 500);
    }
};