import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const AmenitiesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    capacity: {
        type: Number,
        required: true
    },
    amenityType: {
        type: String,
        enum: ['free', 'paid'],
        required: true
    },
    bookingCharge: {
        type: Number,
        default: 0
    },
    bookingType: {
        type: String,
        enum: ['one-time', 'recurring'],
        required: true
    },
    paymentGateway: {
        type: String,
        enum: ['phonepe', 'razorpay', 'paytm', 'none'],
        default: 'none'
    },
    advanceBookingDays: {
        type: Number,
        required: true,
        default: 7
    },
    requiresApproval: {
        type: Boolean,
        default: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    amenityStatus: {
        type: String,
        enum: ['available', 'maintenance', 'unavailable'],
        default: 'available'
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

AmenitiesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
AmenitiesSchema.index({ buildingId: 1 });
AmenitiesSchema.index({ name: 1, buildingId: 1 }, { unique: true, sparse: true });
AmenitiesSchema.index({ isDeleted: 1, status: 1 });
AmenitiesSchema.index({ createdAt: -1 });

const AmenitiesModel = DBConnect.model('amenities', AmenitiesSchema);

AmenitiesModel.syncIndexes().then(() => {
    console.log('Amenities Model Indexes Synced')
}).catch((err) => {
    console.log('Amenities Model Indexes Sync Error', err)
});

export default AmenitiesModel;