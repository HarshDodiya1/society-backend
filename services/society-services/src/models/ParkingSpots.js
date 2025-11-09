import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const ParkingSpotsSchema = new Schema({
    parkingAreaId: {
        type: Schema.Types.ObjectId,
        ref: 'parkingareas',
        required: true
    },
    parkingNumber: {
        type: String,
        required: true
    },
    parkingType: {
        type: String,
        required: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'blocks'
    },
    status: {
        type: String,
        default: 'available'
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

ParkingSpotsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
ParkingSpotsSchema.index({ buildingId: 1 });
ParkingSpotsSchema.index({ isDeleted: 1, status: 1 });
ParkingSpotsSchema.index({ createdAt: -1 });

const ParkingSpotsModel = DBConnect.model('parkingspots', ParkingSpotsSchema);

ParkingSpotsModel.syncIndexes().then(() => {
    console.log('ParkingSpots Model Indexes Synced')
}).catch((err) => {
    console.log('ParkingSpots Model Indexes Sync Error', err)
});

export default ParkingSpotsModel;