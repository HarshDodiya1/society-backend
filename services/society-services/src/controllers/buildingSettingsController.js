import BlocksModel from '../models/Blocks.js';
import FloorsModel from '../models/Floors.js';
import UnitsModel from '../models/Units.js';
import ParkingAreasModel from '../models/ParkingAreas.js';
import ParkingSpotsModel from '../models/ParkingSpots.js';
import BuildingsModel from '../models/Buildings.js';
import { successResponse, errorResponse } from '../utils/response.js';

// ==================== BLOCKS ====================

export const createBlock = async (req, res) => {
    try {
        const { blockName, buildingId } = req.body;

        if (!blockName || !buildingId) {
            return errorResponse(res, 'Block name and building ID are required', 400);
        }

        // Check if block name already exists in this building
        const existingBlock = await BlocksModel.findOne({
            blockName,
            buildingId,
            isDeleted: false
        });

        if (existingBlock) {
            return errorResponse(res, 'Block with this name already exists', 400);
        }

        const newBlock = await BlocksModel.create({
            blockName,
            buildingId,
            createdBy: req.user?._id,
            status: 'active'
        });

        // Update building's totalBlocks count
        await BuildingsModel.findByIdAndUpdate(buildingId, {
            $inc: { totalBlocks: 1 }
        });

        return successResponse(res, newBlock, 'Block created successfully', 201);
    } catch (error) {
        console.error('Create block error:', error);
        return errorResponse(res, error.message || 'Failed to create block', 500);
    }
};

export const getBlocks = async (req, res) => {
    try {
        const { buildingId } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) {
            filter.buildingId = buildingId;
        }

        const blocks = await BlocksModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .sort({ createdAt: -1 });

        return successResponse(res, blocks, 'Blocks fetched successfully');
    } catch (error) {
        console.error('Get blocks error:', error);
        return errorResponse(res, error.message || 'Failed to fetch blocks', 500);
    }
};

export const getBlockById = async (req, res) => {
    try {
        const { id } = req.params;

        const block = await BlocksModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName');

        if (!block) {
            return errorResponse(res, 'Block not found', 404);
        }

        return successResponse(res, block, 'Block fetched successfully');
    } catch (error) {
        console.error('Get block error:', error);
        return errorResponse(res, error.message || 'Failed to fetch block', 500);
    }
};

export const updateBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const { blockName } = req.body;

        const block = await BlocksModel.findOne({ _id: id, isDeleted: false });
        if (!block) {
            return errorResponse(res, 'Block not found', 404);
        }

        // Check if new name already exists
        if (blockName && blockName !== block.blockName) {
            const existingBlock = await BlocksModel.findOne({
                blockName,
                buildingId: block.buildingId,
                isDeleted: false,
                _id: { $ne: id }
            });

            if (existingBlock) {
                return errorResponse(res, 'Block with this name already exists', 400);
            }
        }

        const updatedBlock = await BlocksModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedBlock, 'Block updated successfully');
    } catch (error) {
        console.error('Update block error:', error);
        return errorResponse(res, error.message || 'Failed to update block', 500);
    }
};

export const deleteBlock = async (req, res) => {
    try {
        const { id } = req.params;

        const block = await BlocksModel.findOne({ _id: id, isDeleted: false });
        if (!block) {
            return errorResponse(res, 'Block not found', 404);
        }

        // Soft delete
        await BlocksModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        // Update building's totalBlocks count
        await BuildingsModel.findByIdAndUpdate(block.buildingId, {
            $inc: { totalBlocks: -1 }
        });

        return successResponse(res, null, 'Block deleted successfully');
    } catch (error) {
        console.error('Delete block error:', error);
        return errorResponse(res, error.message || 'Failed to delete block', 500);
    }
};

// ==================== FLOORS ====================

export const createFloor = async (req, res) => {
    try {
        const { floorName, blockId } = req.body;

        if (!floorName || !blockId) {
            return errorResponse(res, 'Floor name and block ID are required', 400);
        }

        const newFloor = await FloorsModel.create({
            floorName,
            blockId,
            createdBy: req.user?._id,
            status: 'active'
        });

        return successResponse(res, newFloor, 'Floor created successfully', 201);
    } catch (error) {
        console.error('Create floor error:', error);
        return errorResponse(res, error.message || 'Failed to create floor', 500);
    }
};

export const createMultipleFloors = async (req, res) => {
    try {
        const { blockId, floorPrefix, numberOfFloors } = req.body;

        if (!blockId || !numberOfFloors) {
            return errorResponse(res, 'Block ID and number of floors are required', 400);
        }

        const floors = [];
        for (let i = 1; i <= numberOfFloors; i++) {
            floors.push({
                floorName: `${floorPrefix || 'Floor'} ${i}`,
                blockId,
                createdBy: req.user?._id,
                status: 'active'
            });
        }

        const createdFloors = await FloorsModel.insertMany(floors);

        return successResponse(res, createdFloors, `${numberOfFloors} floors created successfully`, 201);
    } catch (error) {
        console.error('Create multiple floors error:', error);
        return errorResponse(res, error.message || 'Failed to create floors', 500);
    }
};

export const getFloors = async (req, res) => {
    try {
        const { blockId } = req.query;

        const filter = { isDeleted: false };
        if (blockId) {
            filter.blockId = blockId;
        }

        const floors = await FloorsModel.find(filter)
            .populate({
                path: 'blockId',
                select: 'blockName buildingId',
                populate: { path: 'buildingId', select: 'buildingName societyName' }
            })
            .sort({ createdAt: -1 });

        return successResponse(res, floors, 'Floors fetched successfully');
    } catch (error) {
        console.error('Get floors error:', error);
        return errorResponse(res, error.message || 'Failed to fetch floors', 500);
    }
};

export const getFloorById = async (req, res) => {
    try {
        const { id } = req.params;

        const floor = await FloorsModel.findOne({ _id: id, isDeleted: false })
            .populate('blockId', 'blockName');

        if (!floor) {
            return errorResponse(res, 'Floor not found', 404);
        }

        return successResponse(res, floor, 'Floor fetched successfully');
    } catch (error) {
        console.error('Get floor error:', error);
        return errorResponse(res, error.message || 'Failed to fetch floor', 500);
    }
};

export const updateFloor = async (req, res) => {
    try {
        const { id } = req.params;

        const floor = await FloorsModel.findOne({ _id: id, isDeleted: false });
        if (!floor) {
            return errorResponse(res, 'Floor not found', 404);
        }

        const updatedFloor = await FloorsModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedFloor, 'Floor updated successfully');
    } catch (error) {
        console.error('Update floor error:', error);
        return errorResponse(res, error.message || 'Failed to update floor', 500);
    }
};

export const deleteFloor = async (req, res) => {
    try {
        const { id } = req.params;

        const floor = await FloorsModel.findOne({ _id: id, isDeleted: false });
        if (!floor) {
            return errorResponse(res, 'Floor not found', 404);
        }

        await FloorsModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Floor deleted successfully');
    } catch (error) {
        console.error('Delete floor error:', error);
        return errorResponse(res, error.message || 'Failed to delete floor', 500);
    }
};

// ==================== UNITS ====================

export const createUnit = async (req, res) => {
    try {
        const { unitNumber, unitType, area, floorId, blockId } = req.body;

        if (!unitNumber || !unitType || !area || !floorId || !blockId) {
            return errorResponse(res, 'All unit fields are required', 400);
        }

        // Check if unit already exists
        const existingUnit = await UnitsModel.findOne({
            unitNumber,
            blockId,
            isDeleted: false
        });

        if (existingUnit) {
            return errorResponse(res, 'Unit with this number already exists in this block', 400);
        }

        const newUnit = await UnitsModel.create({
            unitNumber,
            unitType,
            area,
            floorId,
            blockId,
            unitStatus: 'Vacant',
            createdBy: req.user?._id,
            status: 'active'
        });

        // Update building's totalUnits count
        const block = await BlocksModel.findById(blockId);
        if (block) {
            await BuildingsModel.findByIdAndUpdate(block.buildingId, {
                $inc: { totalUnits: 1 }
            });
        }

        return successResponse(res, newUnit, 'Unit created successfully', 201);
    } catch (error) {
        console.error('Create unit error:', error);
        return errorResponse(res, error.message || 'Failed to create unit', 500);
    }
};

export const getUnits = async (req, res) => {
    try {
        const { blockId, floorId, unitStatus } = req.query;

        const filter = { isDeleted: false };
        if (blockId) filter.blockId = blockId;
        if (floorId) filter.floorId = floorId;
        if (unitStatus) filter.unitStatus = unitStatus;

        const units = await UnitsModel.find(filter)
            .populate('blockId', 'blockName')
            .populate('floorId', 'floorName')
            .sort({ createdAt: -1 });

        return successResponse(res, units, 'Units fetched successfully');
    } catch (error) {
        console.error('Get units error:', error);
        return errorResponse(res, error.message || 'Failed to fetch units', 500);
    }
};

export const getUnitById = async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await UnitsModel.findOne({ _id: id, isDeleted: false })
            .populate('blockId', 'blockName')
            .populate('floorId', 'floorName');

        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        return successResponse(res, unit, 'Unit fetched successfully');
    } catch (error) {
        console.error('Get unit error:', error);
        return errorResponse(res, error.message || 'Failed to fetch unit', 500);
    }
};

export const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await UnitsModel.findOne({ _id: id, isDeleted: false });
        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        const updatedUnit = await UnitsModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedUnit, 'Unit updated successfully');
    } catch (error) {
        console.error('Update unit error:', error);
        return errorResponse(res, error.message || 'Failed to update unit', 500);
    }
};

export const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await UnitsModel.findOne({ _id: id, isDeleted: false });
        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        await UnitsModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        // Update building's totalUnits count
        const block = await BlocksModel.findById(unit.blockId);
        if (block) {
            await BuildingsModel.findByIdAndUpdate(block.buildingId, {
                $inc: { totalUnits: -1 }
            });
        }

        return successResponse(res, null, 'Unit deleted successfully');
    } catch (error) {
        console.error('Delete unit error:', error);
        return errorResponse(res, error.message || 'Failed to delete unit', 500);
    }
};

// ==================== PARKING ====================

export const createParkingArea = async (req, res) => {
    try {
        const { parkingName, numberOfMemberCar, numberOfMemberBike, numberOfVisitorCar, numberOfVisitorBike, buildingId } = req.body;

        if (!parkingName || !buildingId) {
            return errorResponse(res, 'Parking name and building ID are required', 400);
        }

        const newParkingArea = await ParkingAreasModel.create({
            parkingName,
            numberOfMemberCar: numberOfMemberCar || 0,
            numberOfMemberBike: numberOfMemberBike || 0,
            numberOfVisitorCar: numberOfVisitorCar || 0,
            numberOfVisitorBike: numberOfVisitorBike || 0,
            buildingId,
            createdBy: req.user?._id,
            status: 'active'
        });

        return successResponse(res, newParkingArea, 'Parking area created successfully', 201);
    } catch (error) {
        console.error('Create parking area error:', error);
        return errorResponse(res, error.message || 'Failed to create parking area', 500);
    }
};

export const getParkingAreas = async (req, res) => {
    try {
        const { buildingId } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;

        const parkingAreas = await ParkingAreasModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .sort({ createdAt: -1 });

        return successResponse(res, parkingAreas, 'Parking areas fetched successfully');
    } catch (error) {
        console.error('Get parking areas error:', error);
        return errorResponse(res, error.message || 'Failed to fetch parking areas', 500);
    }
};

export const createParkingSpot = async (req, res) => {
    try {
        const { parkingAreaId, parkingNumber, parkingType, blockId } = req.body;

        if (!parkingAreaId || !parkingNumber || !parkingType) {
            return errorResponse(res, 'Parking area ID, number, and type are required', 400);
        }

        const newParkingSpot = await ParkingSpotsModel.create({
            parkingAreaId,
            parkingNumber,
            parkingType,
            blockId,
            createdBy: req.user?._id,
            status: 'available'
        });

        return successResponse(res, newParkingSpot, 'Parking spot created successfully', 201);
    } catch (error) {
        console.error('Create parking spot error:', error);
        return errorResponse(res, error.message || 'Failed to create parking spot', 500);
    }
};

export const getParkingSpots = async (req, res) => {
    try {
        const { parkingAreaId, parkingType, status } = req.query;

        const filter = { isDeleted: false };
        if (parkingAreaId) filter.parkingAreaId = parkingAreaId;
        if (parkingType) filter.parkingType = parkingType;
        if (status) filter.status = status;

        const parkingSpots = await ParkingSpotsModel.find(filter)
            .populate('parkingAreaId', 'parkingName')
            .populate('blockId', 'blockName')
            .sort({ parkingNumber: 1 });

        return successResponse(res, parkingSpots, 'Parking spots fetched successfully');
    } catch (error) {
        console.error('Get parking spots error:', error);
        return errorResponse(res, error.message || 'Failed to fetch parking spots', 500);
    }
};

export const updateParkingArea = async (req, res) => {
    try {
        const { id } = req.params;

        const parkingArea = await ParkingAreasModel.findOne({ _id: id, isDeleted: false });
        if (!parkingArea) {
            return errorResponse(res, 'Parking area not found', 404);
        }

        const updatedParkingArea = await ParkingAreasModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedParkingArea, 'Parking area updated successfully');
    } catch (error) {
        console.error('Update parking area error:', error);
        return errorResponse(res, error.message || 'Failed to update parking area', 500);
    }
};

export const deleteParkingArea = async (req, res) => {
    try {
        const { id } = req.params;

        const parkingArea = await ParkingAreasModel.findOne({ _id: id, isDeleted: false });
        if (!parkingArea) {
            return errorResponse(res, 'Parking area not found', 404);
        }

        await ParkingAreasModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Parking area deleted successfully');
    } catch (error) {
        console.error('Delete parking area error:', error);
        return errorResponse(res, error.message || 'Failed to delete parking area', 500);
    }
};
