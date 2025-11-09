import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const MaintenancePaymentsSchema = new Schema({
    billId: {
        type: Schema.Types.ObjectId,
        ref: 'maintenancebills',
        required: true
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units',
        required: true
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members',
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    paymentAmount: {
        type: String,
        required: true
    },
    paidAmount: {
        type: String
    },
    paymentDate: {
        type: Date,
        required: true
    },
    paidDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        default: 'online'
    },
    transactionId: {
        type: String
    },
    paymentGatewayResponse: {
        type: Schema.Types.Mixed
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

// Indexes
MaintenancePaymentsSchema.index({ buildingId: 1 });
MaintenancePaymentsSchema.index({ isDeleted: 1, paymentStatus: 1 });
MaintenancePaymentsSchema.index({ createdAt: -1 });

const MaintenancePaymentsModel = DBConnect.model('maintenancepayments', MaintenancePaymentsSchema);

MaintenancePaymentsModel.syncIndexes().then(() => {
    console.log('MaintenancePayments Model Indexes Synced')
}).catch((err) => {
    console.log('MaintenancePayments Model Indexes Sync Error', err)
});

export default MaintenancePaymentsModel;