import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const BuildingAdminSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true,
        default: '+91'
    },
    phoneNumber: {
        type: String,
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    lastLoginAt: {
        type: Date
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

BuildingAdminSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
BuildingAdminSchema.index({ buildingId: 1 });
BuildingAdminSchema.index({ isDeleted: 1, status: 1 });
BuildingAdminSchema.index({ createdAt: -1 });

const BuildingAdminModel = DBConnect.model('buildingadmins', BuildingAdminSchema);

BuildingAdminModel.syncIndexes().then(() => {
    console.log('BuildingAdmin Model Indexes Synced')
}).catch((err) => {
    console.log('BuildingAdmin Model Indexes Sync Error', err)
});

export default BuildingAdminModel;