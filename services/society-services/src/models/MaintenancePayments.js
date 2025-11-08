import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const MaintenancePaymentsSchema = new Schema({
    billId: {
        type: Schema.Types.ObjectId,
        ref: 'maintenancebills',
        required: true
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members',
        required: true
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    paidAmount: {
        type: String,
        required: true
    },
    paidDate: {
        type: Date,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    receiptUrl: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

MaintenancePaymentsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const MaintenancePaymentsModel = DBConnect.model('maintenancepayments', MaintenancePaymentsSchema)

export default MaintenancePaymentsModel