import { successResponse, errorResponse } from '../utils/response.js';
import UnitsModel from '../models/Units.js';
import FloorsModel from '../models/Floors.js';
import BlocksModel from '../models/Blocks.js';
import BuildingsModel from '../models/Buildings.js';

/**
 * Create Unit
 */
export const createUnit = async (req, res) => {
    try {
        const { blockId, floorId, unitNumber, unitType, area, unitStatus = 'Vacant' } = req.body;
        const userBuildingId = req.user.buildingId;

        // Validation
        if (!blockId || !floorId || !unitNumber || !unitType || !area) {
            return errorResponse(res, 'All fields are required: blockId, floorId, unitNumber, unitType, area', 400);
        }

        // Check if floor exists and belongs to user's building
        const floor = await FloorsModel.findOne({
            _id: floorId,
            isDeleted: false
        });

        if (!floor) {
            return errorResponse(res, 'Floor not found', 404);
        }

        // Check if block exists
        const block = await BlocksModel.findOne({
            _id: blockId,
            isDeleted: false
        });

        if (!block) {
            return errorResponse(res, 'Block not found', 404);
        }

        if (block.buildingId.toString() !== userBuildingId.toString()) {
            return errorResponse(res, 'Access denied. You can only create units in your building.', 403);
        }

        // Check if blockId matches floor's blockId
        if (floor.blockId.toString() !== blockId) {
            return errorResponse(res, 'Block ID does not match the floor\'s block', 400);
        }

        // Check if unit number already exists in this floor
        const existingUnit = await UnitsModel.findOne({
            unitNumber,
            floorId,
            isDeleted: false
        });

        if (existingUnit) {
            return errorResponse(res, 'Unit with this number already exists on this floor', 400);
        }

        // Create unit
        const unit = await UnitsModel.create({
            unitNumber,
            unitType,
            area,
            floorId,
            blockId,
            unitStatus,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Update building's totalUnits
        await BuildingsModel.findByIdAndUpdate(userBuildingId, {
            $inc: { totalUnits: 1 },
            updatedAt: new Date()
        });

        return successResponse(res, {
            unit: {
                id: unit._id,
                unitNumber: unit.unitNumber,
                unitType: unit.unitType,
                area: unit.area,
                floorId: unit.floorId,
                blockId: unit.blockId,
                unitStatus: unit.unitStatus
            }
        }, 'Unit created successfully', 201);
    } catch (error) {
        console.error('Create Unit Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get All Units for a Floor
 */
export const getUnitsByFloor = async (req, res) => {
    try {
        const { floorId } = req.params;
        const userBuildingId = req.user.buildingId;

        // Check if floor exists
        const floor = await FloorsModel.findOne({
            _id: floorId,
            isDeleted: false
        });

        if (!floor) {
            return errorResponse(res, 'Floor not found', 404);
        }

        // Check if block belongs to user's building
        const block = await BlocksModel.findOne({
            _id: floor.blockId,
            isDeleted: false
        });

        if (!block || block.buildingId.toString() !== userBuildingId.toString()) {
            return errorResponse(res, 'Access denied. You can only view units in your building.', 403);
        }

        const { page = 1, limit = 100, search = '', unitStatus } = req.query;

        const query = { floorId, isDeleted: false };

        if (search) {
            query.$or = [
                { unitNumber: { $regex: search, $options: 'i' } },
                { unitType: { $regex: search, $options: 'i' } }
            ];
        }

        if (unitStatus) {
            query.unitStatus = unitStatus;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const units = await UnitsModel.find(query)
            .sort({ unitNumber: 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await UnitsModel.countDocuments(query);

        return successResponse(res, {
            units,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        }, 'Units fetched successfully');
    } catch (error) {
        console.error('Get Units Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get All Units for a Block
 */
export const getUnitsByBlock = async (req, res) => {
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
            return errorResponse(res, 'Access denied. You can only view units in your building.', 403);
        }

        const { page = 1, limit = 100, search = '', unitStatus } = req.query;

        const query = { blockId, isDeleted: false };

        if (search) {
            query.$or = [
                { unitNumber: { $regex: search, $options: 'i' } },
                { unitType: { $regex: search, $options: 'i' } }
            ];
        }

        if (unitStatus) {
            query.unitStatus = unitStatus;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const units = await UnitsModel.find(query)
            .populate('floorId', 'floorName')
            .sort({ floorId: 1, unitNumber: 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await UnitsModel.countDocuments(query);

        return successResponse(res, {
            units,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        }, 'Units fetched successfully');
    } catch (error) {
        console.error('Get Units Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Update Unit Status
 */
export const updateUnitStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { unitStatus } = req.body;
        const userBuildingId = req.user.buildingId;

        // Validation
        if (!unitStatus || !['Vacant', 'Occupied', 'Under Maintenance'].includes(unitStatus)) {
            return errorResponse(res, 'Valid unitStatus is required (Vacant, Occupied, Under Maintenance)', 400);
        }

        // Find the unit
        const unit = await UnitsModel.findOne({
            _id: id,
            isDeleted: false
        });

        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        // Check if unit belongs to user's building
        const block = await BlocksModel.findOne({
            _id: unit.blockId,
            isDeleted: false
        });

        if (!block || block.buildingId.toString() !== userBuildingId.toString()) {
            return errorResponse(res, 'Access denied. You can only update units in your building.', 403);
        }

        // Update unit status
        const updatedUnit = await UnitsModel.findByIdAndUpdate(id, {
            unitStatus,
            updatedAt: new Date()
        }, { new: true });

        return successResponse(res, {
            unit: {
                id: updatedUnit._id,
                unitNumber: updatedUnit.unitNumber,
                unitStatus: updatedUnit.unitStatus
            }
        }, 'Unit status updated successfully');
    } catch (error) {
        console.error('Update Unit Status Error:', error);
        return errorResponse(res, error.message, 500);
    }
};