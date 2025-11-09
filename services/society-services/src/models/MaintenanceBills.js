import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const MaintenanceBillsSchema = new Schema({
    maintenanceTypeId: {
        type: Schema.Types.ObjectId,
        ref: 'maintenancetypes',
        required: true
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units',
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalOwnerAmount: {
        type: String,
        required: true
    },
    totalTenantAmount: {
        type: String,
        required: true
    },
    lateFeeEnabled: {
        type: Boolean,
        default: false
    },
    lateFeeType: {
        type: String
    },
    lateFeeAmount: {
        type: String
    },
    description: {
        type: String
    },
    published: {
        type: Boolean,
        default: false
    },
    billStatus: {
        type: String,
        default: 'draft'
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

MaintenanceBillsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
MaintenanceBillsSchema.index({ buildingId: 1 });
MaintenanceBillsSchema.index({ isDeleted: 1, billStatus: 1 });
MaintenanceBillsSchema.index({ createdAt: -1 });

const MaintenanceBillsModel = DBConnect.model('maintenancebills', MaintenanceBillsSchema);

MaintenanceBillsModel.syncIndexes().then(() => {
    console.log('MaintenanceBills Model Indexes Synced')
}).catch((err) => {
    console.log('MaintenanceBills Model Indexes Sync Error', err)
});

export default MaintenanceBillsModel;