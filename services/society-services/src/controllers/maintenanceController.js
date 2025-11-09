import MaintenanceBillsModel from '../models/MaintenanceBills.js';
import UnitsModel from '../models/Units.js';
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
