import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const BuildingsSchema = new Schema({
    buildingName: {
        type: String,
        required: true
    },
    societyName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    territory: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    totalBlocks: {
        type: Number,
        default: 0
    },
    totalUnits: {
        type: Number,
        default: 0
    },
    buildingType: {
        type: String
    },
    buildingLogo: {
        type: String
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'projects'
    },
    approveBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    approveAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
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

BuildingsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const BuildingsModel = DBConnect.model('buildings', BuildingsSchema);

export default BuildingsModel;