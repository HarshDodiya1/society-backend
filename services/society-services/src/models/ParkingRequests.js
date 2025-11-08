import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const ParkingRequestsSchema = new Schema({
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
    vehicleType: {
        type: String,
        required: true,
        enum: ['2-Wheeler', '4-Wheeler']
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    requestedSpotId: {
        type: Schema.Types.ObjectId,
        ref: 'parkingspots'
    },
    assignedSpotId: {
        type: Schema.Types.ObjectId,
        ref: 'parkingspots'
    },
    requestStatus: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    remarks: {
        type: String
    },
    adminRemarks: {
        type: String
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    approvedAt: {
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

ParkingRequestsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const ParkingRequestsModel = DBConnect.model('parkingrequests', ParkingRequestsSchema);

export default ParkingRequestsModel;
