import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const AmenitySlotsSchema = new Schema({
    amenityId: {
        type: Schema.Types.ObjectId,
        ref: 'amenities',
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    slotStatus: {
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

AmenitySlotsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
AmenitySlotsSchema.index({ buildingId: 1 });
AmenitySlotsSchema.index({ isDeleted: 1, status: 1 });
AmenitySlotsSchema.index({ createdAt: -1 });

const AmenitySlotsModel = DBConnect.model('amenityslots', AmenitySlotsSchema);

AmenitySlotsModel.syncIndexes().then(() => {
    console.log('AmenitySlots Model Indexes Synced')
}).catch((err) => {
    console.log('AmenitySlots Model Indexes Sync Error', err)
});

export default AmenitySlotsModel;