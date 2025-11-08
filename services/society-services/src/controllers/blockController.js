import { successResponse, errorResponse } from '../utils/response.js';
import BlocksModel from '../models/Blocks.js';
import BuildingsModel from '../models/Buildings.js';

/**
 * Create Block
 */
export const createBlock = async (req, res) => {
    try {
        const { blockName } = req.body;
        console.log("User details ", req.user);
        const buildingId = req.user.buildingId;

        // Validation
        if (!blockName) {
            return errorResponse(res, 'Block name is required', 400);
        }

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        // Check if building exists
        const building = await BuildingsModel.findOne({
            _id: buildingId,
            isDeleted: false
        });

        if (!building) {
            return errorResponse(res, 'Building not found', 404);
        }

        // Check if block name already exists in this building
        const existingBlock = await BlocksModel.findOne({
            blockName,
            buildingId,
            isDeleted: false
        });

        if (existingBlock) {
            return errorResponse(res, 'Block with this name already exists in the building', 400);
        }

        // Create block (don't set createdBy - optional field)
        const block = await BlocksModel.create({
            blockName,
            buildingId,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Update building's totalBlocks
        await BuildingsModel.findByIdAndUpdate(buildingId, {
            $inc: { totalBlocks: 1 },
            updatedAt: new Date()
        });

        return successResponse(res, {
            block: {
                id: block._id,
                blockName: block.blockName,
                buildingId: block.buildingId,
                status: block.status
            }
        }, 'Block created successfully', 201);
    } catch (error) {
        console.error('Create Block Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get All Blocks for a Society (Building)
 */
export const getBlocksBySociety = async (req, res) => {
    try {
        const { societyId } = req.params;
        const buildingId = req.user.buildingId;

        // Check if the societyId matches the user's buildingId
        if (societyId !== buildingId.toString()) {
            return errorResponse(res, 'Access denied. You can only view blocks for your building.', 403);
        }

        const { page = 1, limit = 100, search = '', status } = req.query;

        const query = { buildingId: societyId, isDeleted: false };

        if (search) {
            query.blockName = { $regex: search, $options: 'i' };
        }

        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const blocks = await BlocksModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await BlocksModel.countDocuments(query);

        return successResponse(res, {
            blocks,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        }, 'Blocks fetched successfully');
    } catch (error) {
        console.error('Get Blocks Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Update Block Details
 */
export const updateBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const { blockName, status } = req.body;
        const buildingId = req.user.buildingId;

        // Find the block
        const block = await BlocksModel.findOne({
            _id: id,
            isDeleted: false
        });

        if (!block) {
            return errorResponse(res, 'Block not found', 404);
        }

        // Check if block belongs to user's building
        if (block.buildingId.toString() !== buildingId.toString()) {
            return errorResponse(res, 'Access denied. You can only update blocks in your building.', 403);
        }

        // Check if new block name conflicts
        if (blockName && blockName !== block.blockName) {
            const existingBlock = await BlocksModel.findOne({
                blockName,
                buildingId,
                _id: { $ne: id },
                isDeleted: false
            });

            if (existingBlock) {
                return errorResponse(res, 'Block with this name already exists in the building', 400);
            }
        }

        // Update block
        const updateData = {
            updatedAt: new Date()
        };

        if (blockName) updateData.blockName = blockName;
        if (status) updateData.status = status;

        const updatedBlock = await BlocksModel.findByIdAndUpdate(id, updateData, { new: true });

        return successResponse(res, {
            block: {
                id: updatedBlock._id,
                blockName: updatedBlock.blockName,
                buildingId: updatedBlock.buildingId,
                status: updatedBlock.status
            }
        }, 'Block updated successfully');
    } catch (error) {
        console.error('Update Block Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Delete Block
 */
export const deleteBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const buildingId = req.user.buildingId;

        // Find the block
        const block = await BlocksModel.findOne({
            _id: id,
            isDeleted: false
        });

        if (!block) {
            return errorResponse(res, 'Block not found', 404);
        }

        // Check if block belongs to user's building
        if (block.buildingId.toString() !== buildingId.toString()) {
            return errorResponse(res, 'Access denied. You can only delete blocks in your building.', 403);
        }

        // Soft delete the block
        await BlocksModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedAt: new Date()
        });

        // Update building's totalBlocks
        await BuildingsModel.findByIdAndUpdate(buildingId, {
            $inc: { totalBlocks: -1 },
            updatedAt: new Date()
        });

        return successResponse(res, null, 'Block deleted successfully');
    } catch (error) {
        console.error('Delete Block Error:', error);
        return errorResponse(res, error.message, 500);
    }
};