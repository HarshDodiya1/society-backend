import { successResponse, errorResponse } from '../utils/response.js';
import FloorsModel from '../models/Floors.js';
import BlocksModel from '../models/Blocks.js';
import BuildingsModel from '../models/Buildings.js';

/**
 * Create Floors (Bulk)
 */
export const createFloors = async (req, res) => {
    try {
        const { blockId, floorNamePrefix, startFloorNumber, endFloorNumber } = req.body;
        const userBuildingId = req.user.buildingId;

        // Validation
        if (!blockId || !floorNamePrefix || startFloorNumber === undefined || endFloorNumber === undefined) {
            return errorResponse(res, 'All fields are required: blockId, floorNamePrefix, startFloorNumber, endFloorNumber', 400);
        }

        if (startFloorNumber > endFloorNumber) {
            return errorResponse(res, 'Start floor number must be less than or equal to end floor number', 400);
        }

        // Check if block exists and belongs to user's building
        const block = await BlocksModel.findOne({
            _id: blockId,
            isDeleted: false
        });

        if (!block) {
            return errorResponse(res, 'Block not found', 404);
        }

        if (block.buildingId.toString() !== userBuildingId.toString()) {
            return errorResponse(res, 'Access denied. You can only create floors for blocks in your building.', 403);
        }

        // Check for existing floor names in this block
        const existingFloors = await FloorsModel.find({
            blockId,
            isDeleted: false
        }).select('floorName');

        const existingNames = existingFloors.map(f => f.floorName);

        const floorsToCreate = [];
        for (let i = startFloorNumber; i <= endFloorNumber; i++) {
            const floorName = `${floorNamePrefix}${i}`;
            if (existingNames.includes(floorName)) {
                return errorResponse(res, `Floor "${floorName}" already exists in this block`, 400);
            }
            floorsToCreate.push({
                floorName,
                blockId,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        // Create floors
        const createdFloors = await FloorsModel.insertMany(floorsToCreate);

        return successResponse(res, {
            floors: createdFloors.map(floor => ({
                id: floor._id,
                floorName: floor.floorName,
                blockId: floor.blockId
            }))
        }, `${createdFloors.length} floors created successfully`, 201);
    } catch (error) {
        console.error('Create Floors Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get All Floors for a Block
 */
export const getFloorsByBlock = async (req, res) => {
    try {
        const { blockId } = req.params;
        const userBuildingId = req.user.buildingId;

        // Check if block exists and belongs to user's building
        const block = await BlocksModel.findOne({
            _id: blockId,
            isDeleted: false
        });

        if (!block) {
            return errorResponse(res, 'Block not found', 404);
        }

        if (block.buildingId.toString() !== userBuildingId.toString()) {
            return errorResponse(res, 'Access denied. You can only view floors for blocks in your building.', 403);
        }

        const { page = 1, limit = 100, search = '', status } = req.query;

        const query = { blockId, isDeleted: false };

        if (search) {
            query.floorName = { $regex: search, $options: 'i' };
        }

        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const floors = await FloorsModel.find(query)
            .sort({ floorName: 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await FloorsModel.countDocuments(query);

        return successResponse(res, {
            floors,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        }, 'Floors fetched successfully');
    } catch (error) {
        console.error('Get Floors Error:', error);
        return errorResponse(res, error.message, 500);
    }
};