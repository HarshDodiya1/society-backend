import MaintenanceBillsModel from '../models/MaintenanceBills.js';
import MaintenanceTypesModel from '../models/MaintenanceTypes.js';
import MaintenancePaymentsModel from '../models/MaintenancePayments.js';
import UnitsModel from '../models/Units.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createMaintenanceBill = async (req, res) => {
    try {
        const {
            name, description, billDate, dueDate, period, buildingId, blockIds,
            floorIds, unitIds, billFor, lateFee, totalAmount
        } = req.body;

        if (!name || !description || !billDate || !dueDate || !period || !buildingId) {
            return errorResponse(res, 'Required fields are missing', 400);
        }

        const [month, year] = period.split('/');

        const newBill = await MaintenanceBillsModel.create({
            name,
            description,
            billDate,
            dueDate,
            month: parseInt(month),
            year: parseInt(year),
            buildingId,
            blockIds: blockIds || [],
            floorIds: floorIds || [],
            unitIds: unitIds || [],
            billFor: billFor || 'owner',
            lateFeeEnabled: lateFee?.enabled || false,
            lateFeeType: lateFee?.type,
            lateFeeAmount: lateFee?.amount,
            totalOwnerAmount: billFor === 'owner' ? totalAmount : 0,
            totalTenantAmount: billFor === 'tenant' ? totalAmount : 0,
            billStatus: 'draft',
            createdBy: req.user?._id,
            status: 'active'
        });

        return successResponse(res, newBill, 'Maintenance bill created successfully', 201);
    } catch (error) {
        console.error('Create maintenance bill error:', error);
        return errorResponse(res, error.message || 'Failed to create maintenance bill', 500);
    }
};

export const getMaintenanceBills = async (req, res) => {
    try {
        const { buildingId, billStatus, month, year } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;
        if (billStatus) filter.billStatus = billStatus;
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);

        const bills = await MaintenanceBillsModel.find(filter)
            .populate('buildingId', 'buildingName societyName')
            .populate('blockIds', 'blockName')
            .populate('unitIds', 'unitNumber')
            .sort({ billDate: -1 });

        return successResponse(res, bills, 'Maintenance bills fetched successfully');
    } catch (error) {
        console.error('Get maintenance bills error:', error);
        return errorResponse(res, error.message || 'Failed to fetch maintenance bills', 500);
    }
};

export const getMaintenanceBillById = async (req, res) => {
    try {
        const { id } = req.params;

        const bill = await MaintenanceBillsModel.findOne({ _id: id, isDeleted: false })
            .populate('buildingId', 'buildingName societyName')
            .populate('blockIds', 'blockName')
            .populate('floorIds', 'floorName')
            .populate('unitIds', 'unitNumber');

        if (!bill) {
            return errorResponse(res, 'Maintenance bill not found', 404);
        }

        return successResponse(res, bill, 'Maintenance bill fetched successfully');
    } catch (error) {
        console.error('Get maintenance bill error:', error);
        return errorResponse(res, error.message || 'Failed to fetch maintenance bill', 500);
    }
};

export const updateMaintenanceBill = async (req, res) => {
    try {
        const { id } = req.params;

        const bill = await MaintenanceBillsModel.findOne({ _id: id, isDeleted: false });
        if (!bill) {
            return errorResponse(res, 'Maintenance bill not found', 404);
        }

        const updatedBill = await MaintenanceBillsModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: req.user?._id, updatedAt: new Date() },
            { new: true }
        );

        return successResponse(res, updatedBill, 'Maintenance bill updated successfully');
    } catch (error) {
        console.error('Update maintenance bill error:', error);
        return errorResponse(res, error.message || 'Failed to update maintenance bill', 500);
    }
};

export const publishMaintenanceBill = async (req, res) => {
    try {
        const { id } = req.params;

        const bill = await MaintenanceBillsModel.findOne({ _id: id, isDeleted: false });
        if (!bill) {
            return errorResponse(res, 'Maintenance bill not found', 404);
        }

        const updatedBill = await MaintenanceBillsModel.findByIdAndUpdate(
            id,
            {
                billStatus: 'published',
                updatedBy: req.user?._id,
                updatedAt: new Date()
            },
            { new: true }
        );

        return successResponse(res, updatedBill, 'Maintenance bill published successfully');
    } catch (error) {
        console.error('Publish maintenance bill error:', error);
        return errorResponse(res, error.message || 'Failed to publish maintenance bill', 500);
    }
};

export const deleteMaintenanceBill = async (req, res) => {
    try {
        const { id } = req.params;

        const bill = await MaintenanceBillsModel.findOne({ _id: id, isDeleted: false });
        if (!bill) {
            return errorResponse(res, 'Maintenance bill not found', 404);
        }

        await MaintenanceBillsModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            updatedBy: req.user?._id
        });

        return successResponse(res, null, 'Maintenance bill deleted successfully');
    } catch (error) {
        console.error('Delete maintenance bill error:', error);
        return errorResponse(res, error.message || 'Failed to delete maintenance bill', 500);
    }
};

export const getMaintenanceBillStats = async (req, res) => {
    try {
        const { buildingId, month, year } = req.query;

        if (!buildingId) {
            return errorResponse(res, 'Building ID is required', 400);
        }

        const filter = { buildingId };
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);

        const stats = await MaintenanceBillsModel.aggregate([
            { $match: filter },
            { $group: { _id: '$billStatus', count: { $sum: 1 }, totalAmount: { $sum: '$totalOwnerAmount' } } }
        ]);

        const statsObj = {
            total: 0,
            draft: 0,
            published: 0,
            paid: 0,
            due: 0,
            totalAmount: 0
        };

        stats.forEach(stat => {
            statsObj[stat._id] = stat.count;
            statsObj.total += stat.count;
            statsObj.totalAmount += parseFloat(stat.totalAmount || 0);
        });

        return successResponse(res, statsObj, 'Maintenance bill stats fetched successfully');
    } catch (error) {
        console.error('Get maintenance bill stats error:', error);
        return errorResponse(res, error.message || 'Failed to fetch maintenance bill stats', 500);
    }
};

export const createMaintenanceType = async (req, res) => {
    try {
        const { name, description, buildingId } = req.body;

        if (!name || !buildingId) {
            return errorResponse(res, 'Name and building ID are required', 400);
        }

        const newType = await MaintenanceTypesModel.create({
            name,
            description,
            buildingId,
            createdBy: req.user?._id,
            status: 'active'
        });

        return successResponse(res, newType, 'Maintenance type created successfully', 201);
    } catch (error) {
        console.error('Create maintenance type error:', error);
        return errorResponse(res, error.message || 'Failed to create maintenance type', 500);
    }
};

export const getMaintenanceTypes = async (req, res) => {
    try {
        const { buildingId } = req.query;

        const filter = { isDeleted: false };
        if (buildingId) filter.buildingId = buildingId;

        const types = await MaintenanceTypesModel.find(filter)
            .populate('buildingId', 'buildingName')
            .sort({ name: 1 });

        return successResponse(res, types, 'Maintenance types fetched successfully');
    } catch (error) {
        console.error('Get maintenance types error:', error);
        return errorResponse(res, error.message || 'Failed to fetch maintenance types', 500);
    }
};
