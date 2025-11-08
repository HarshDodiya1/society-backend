import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const VisitorsSchema = new Schema({
    visitorName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    visitorImage: {
        type: String
    },
    vehicleNumber: {
        type: String
    },
    visitorType: {
        type: String,
        enum: ['employee', 'member', 'tenant', 'vendor', 'delivery'],
        default: 'member'
    },
    purpose: {
        type: String,
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'blocks'
    },
    floorId: {
        type: Schema.Types.ObjectId,
        ref: 'floors'
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units'
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members'
    },
    checkInTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkOutTime: {
        type: Date
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    approvedAt: {
        type: Date
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

VisitorsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const VisitorsModel = DBConnect.model('visitors', VisitorsSchema);

export default VisitorsModel;