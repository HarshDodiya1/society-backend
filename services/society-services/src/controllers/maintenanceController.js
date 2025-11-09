import MaintenanceBillsModel from '../models/MaintenanceBills.js';
import UnitsModel from '../models/Units.js';
import BlocksModel from '../models/Blocks.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Admin: Get all bills (view who paid and who didn't)
export const getAllBills = async (req, res) => {
    try {
        const { buildingId, month, year, isPaid } = req.query;

        const filter = {};
        if (buildingId) filter.buildingId = buildingId;
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);
        if (isPaid !== undefined) filter.isPaid = isPaid === 'true';

        const bills = await MaintenanceBillsModel.find(filter)
            .populate('unitId', 'unitNumber')
            .populate('buildingId', 'buildingName')
            .sort({ year: -1, month: -1, isPaid: 1 });

        return successResponse(res, bills, 'Bills fetched successfully');
    } catch (error) {
        console.error('Get bills error:', error);
        return errorResponse(res, error.message || 'Failed to fetch bills', 500);
    }
};

// Resident: Get bills for a specific unit
export const getUnitBills = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        const bills = await MaintenanceBillsModel.find({ unitId })
            .sort({ year: -1, month: -1 });

        return successResponse(res, bills, 'Bills fetched successfully');
    } catch (error) {
        console.error('Get unit bills error:', error);
        return errorResponse(res, error.message || 'Failed to fetch bills', 500);
    }
};

// Resident: Get single bill details
export const getBillById = async (req, res) => {
    try {
        const { id } = req.params;

        const bill = await MaintenanceBillsModel.findById(id)
            .populate('unitId', 'unitNumber')
            .populate('buildingId', 'buildingName');

        if (!bill) {
            return errorResponse(res, 'Bill not found', 404);
        }

        return successResponse(res, bill, 'Bill fetched successfully');
    } catch (error) {
        console.error('Get bill error:', error);
        return errorResponse(res, error.message || 'Failed to fetch bill', 500);
    }
};

// Resident: Pay bill (simulation)
export const payBill = async (req, res) => {
    try {
        const { billId, paymentMethod } = req.body;

        if (!billId || !paymentMethod) {
            return errorResponse(res, 'Bill ID and payment method are required', 400);
        }

        const bill = await MaintenanceBillsModel.findById(billId);

        if (!bill) {
            return errorResponse(res, 'Bill not found', 404);
        }

        if (bill.isPaid) {
            return errorResponse(res, 'Bill already paid', 400);
        }

        // Simulate payment
        const transactionId = `${paymentMethod.toUpperCase()}_${Date.now()}`;

        // Update using findByIdAndUpdate to avoid validation issues with old schema data
        const updatedBill = await MaintenanceBillsModel.findByIdAndUpdate(
            billId,
            {
                isPaid: true,
                paidDate: new Date(),
                paymentMethod: paymentMethod,
                transactionId: transactionId,
                updatedAt: new Date()
            },
            { new: true, runValidators: false }
        );

        return successResponse(res, updatedBill, 'Payment successful');
    } catch (error) {
        console.error('Pay bill error:', error);
        return errorResponse(res, error.message || 'Failed to process payment', 500);
    }
};

// Development: Seed sample bills for a unit
export const seedSampleBills = async (req, res) => {
    try {
        const { unitId, buildingId } = req.body;

        if (!unitId || !buildingId) {
            return errorResponse(res, 'Unit ID and Building ID are required', 400);
        }

        // Verify unit exists
        const unit = await UnitsModel.findById(unitId);
        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        // Seed sample data
        const bills = await MaintenanceBillsModel.seedSampleData(unitId, buildingId);

        return successResponse(res, bills, 'Sample bills created successfully');
    } catch (error) {
        console.error('Seed sample bills error:', error);
        return errorResponse(res, error.message || 'Failed to create sample bills', 500);
    }
};

// Admin: Generate bills for all units in a building for a specific month
export const generateBillsForAllUnits = async (req, res) => {
    try {
        const { buildingId, month, year, amount } = req.body;

        if (!buildingId || !month || !year || !amount) {
            return errorResponse(res, 'Building ID, month, year, and amount are required', 400);
        }

        // Validate month and year
        if (month < 1 || month > 12) {
            return errorResponse(res, 'Month must be between 1 and 12', 400);
        }
        if (year < 2020 || year > 2100) {
            return errorResponse(res, 'Invalid year', 400);
        }

        // Check if bills already exist for this building/month/year
        const existingBills = await MaintenanceBillsModel.find({ buildingId, month, year });
        if (existingBills.length > 0) {
            return errorResponse(res, `Bills already exist for ${month}/${year}. Found ${existingBills.length} bills.`, 400);
        }

        // Get all blocks in the building
        const blocks = await BlocksModel.find({
            buildingId,
            isDeleted: false,
            status: 'active'
        });

        if (blocks.length === 0) {
            return errorResponse(res, 'No active blocks found in this building', 404);
        }

        const blockIds = blocks.map(block => block._id);

        // Get all units in the building (through blocks)
        const units = await UnitsModel.find({
            blockId: { $in: blockIds },
            isDeleted: false,
            status: 'active'
        });

        if (units.length === 0) {
            return errorResponse(res, 'No active units found in this building', 404);
        }

        // Create due date (15th of the month)
        const dueDate = new Date(year, month - 1, 15);

        // Generate bills for all units
        const billsToCreate = units.map(unit => ({
            unitId: unit._id,
            buildingId: buildingId,
            month: parseInt(month),
            year: parseInt(year),
            amount: parseFloat(amount),
            dueDate: dueDate,
            isPaid: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // Insert all bills
        const createdBills = await MaintenanceBillsModel.insertMany(billsToCreate);

        console.log(`✅ Generated ${createdBills.length} maintenance bills for ${month}/${year}`);

        return successResponse(res, {
            count: createdBills.length,
            month,
            year,
            amount,
            bills: createdBills
        }, `Successfully generated ${createdBills.length} bills for all units`);
    } catch (error) {
        console.error('Generate bills error:', error);
        return errorResponse(res, error.message || 'Failed to generate bills', 500);
    }
};
