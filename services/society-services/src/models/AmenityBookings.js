import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const AmenityBookingsSchema = new Schema({
    amenityId: {
        type: Schema.Types.ObjectId,
        ref: 'amenities',
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
    bookingDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    amenityBookingSlotId: {
        type: Schema.Types.ObjectId,
        ref: 'amenityslots'
    },
    bookingAmount: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    bookingStatus: {
        type: String,
        default: 'pending'
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

AmenityBookingsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const AmenityBookingsModel = DBConnect.model('amenitybookings', AmenityBookingsSchema)

AmenityBookingsModel.syncIndexes().then(() => {
    console.log('AmenityBookings Model Indexes Synced')
}).catch((err) => {
    console.log('AmenityBookings Model Indexes Sync Error', err)
});

export default AmenityBookingsModel