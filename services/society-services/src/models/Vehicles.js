import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const VehiclesSchema = new Schema({
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members',
        required: true
    },
    vehicleImage: {
        type: String
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    rcBookImage: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
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

VehiclesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
VehiclesSchema.index({ isDeleted: 1, status: 1 });
VehiclesSchema.index({ createdAt: -1 });
VehiclesSchema.index({ vehicleNo: 1 }, { unique: false, sparse: true });

const VehiclesModel = DBConnect.model('vehicles', VehiclesSchema);

VehiclesModel.syncIndexes().then(() => {
    console.log('Vehicles Model Indexes Synced')
}).catch((err) => {
    console.log('Vehicles Model Indexes Sync Error', err)
});

export default VehiclesModel;