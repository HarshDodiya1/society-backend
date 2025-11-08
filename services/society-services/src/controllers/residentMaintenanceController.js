import MaintenanceBillsModel from '../models/MaintenanceBills.js';
import MaintenancePaymentsModel from '../models/MaintenancePayments.js';
import UnitsModel from '../models/Units.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Get maintenance bills for a unit
export const getResidentBills = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        const unit = await UnitsModel.findById(unitId)
            .populate({
                path: 'floorId',
                populate: { path: 'blockId' }
            });

        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        const buildingId = unit.floorId?.blockId?.buildingId;
        const blockId = unit.floorId?.blockId?._id;

        // Get bills - either for all blocks or specific block
        const bills = await MaintenanceBillsModel.find({
            buildingId,
            billStatus: 'published',
            isDeleted: false,
            $or: [
                { blockIds: { $size: 0 } },
                { blockIds: blockId }
            ]
        })
            .populate('maintenanceTypeId', 'typeName description')
            .sort({ billYear: -1, billMonth: -1 });

        // For each bill, check payment status
        const billsWithPaymentStatus = await Promise.all(bills.map(async (bill) => {
            const payment = await MaintenancePaymentsModel.findOne({
                billId: bill._id,
                unitId,
                paymentStatus: 'success'
            });

            return {
                ...bill.toObject(),
                isPaid: !!payment,
                paymentDetails: payment || null
            };
        }));

        return successResponse(res, billsWithPaymentStatus, 'Bills fetched successfully');
    } catch (error) {
        console.error('Get resident bills error:', error);
        return errorResponse(res, error.message || 'Failed to fetch bills', 500);
    }
};

// Get single bill details
export const getBillDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { unitId } = req.query;

        const bill = await MaintenanceBillsModel.findOne({
            _id: id,
            billStatus: 'published',
            isDeleted: false
        }).populate('maintenanceTypeId');

        if (!bill) {
            return errorResponse(res, 'Bill not found', 404);
        }

        // Check payment status
        const payment = await MaintenancePaymentsModel.findOne({
            billId: id,
            unitId,
            paymentStatus: 'success'
        });

        return successResponse(res, {
            ...bill.toObject(),
            isPaid: !!payment,
            paymentDetails: payment || null
        }, 'Bill details fetched successfully');
    } catch (error) {
        console.error('Get bill details error:', error);
        return errorResponse(res, error.message || 'Failed to fetch bill details', 500);
    }
};

// Mock payment (for now)
export const payBill = async (req, res) => {
    try {
        const { billId, unitId, memberId, paymentAmount, paymentMethod } = req.body;

        if (!billId || !unitId || !memberId || !paymentAmount) {
            return errorResponse(res, 'Missing required fields', 400);
        }

        // Check if already paid
        const existingPayment = await MaintenancePaymentsModel.findOne({
            billId,
            unitId,
            paymentStatus: 'success'
        });

        if (existingPayment) {
            return errorResponse(res, 'Bill already paid', 400);
        }

        // Get bill
        const bill = await MaintenanceBillsModel.findById(billId);
        if (!bill) {
            return errorResponse(res, 'Bill not found', 404);
        }

        // Get unit for building ID
        const unit = await UnitsModel.findById(unitId)
            .populate({
                path: 'floorId',
                populate: { path: 'blockId' }
            });

        if (!unit) {
            return errorResponse(res, 'Unit not found', 404);
        }

        const buildingId = unit.floorId?.blockId?.buildingId;

        // Mock payment gateway response
        const mockTransactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create payment record
        const payment = await MaintenancePaymentsModel.create({
            billId,
            unitId,
            memberId,
            buildingId,
            paymentAmount,
            paymentDate: new Date(),
            paymentMethod: paymentMethod || 'online',
            paymentStatus: 'success', // Mock success
            transactionId: mockTransactionId,
            paymentGatewayResponse: {
                status: 'success',
                message: 'Payment successful (MOCK)',
                transactionId: mockTransactionId,
                timestamp: new Date()
            },
            createdBy: memberId
        });

        return successResponse(res, payment, 'Payment successful (MOCK)', 201);
    } catch (error) {
        console.error('Pay bill error:', error);
        return errorResponse(res, error.message || 'Payment failed', 500);
    }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
    try {
        const { unitId } = req.query;

        if (!unitId) {
            return errorResponse(res, 'Unit ID is required', 400);
        }

        const payments = await MaintenancePaymentsModel.find({
            unitId,
            paymentStatus: 'success'
        })
            .populate({
                path: 'billId',
                select: 'billMonth billYear amount maintenanceTypeId',
                populate: {
                    path: 'maintenanceTypeId',
                    select: 'typeName'
                }
            })
            .sort({ paymentDate: -1 });

        return successResponse(res, payments, 'Payment history fetched successfully');
    } catch (error) {
        console.error('Get payment history error:', error);
        return errorResponse(res, error.message || 'Failed to fetch payment history', 500);
    }
};
