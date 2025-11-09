import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const ParkingAreasSchema = new Schema({
    parkingName: {
        type: String,
        required: true
    },
    numberOfMemberCar: {
        type: Number,
        required: true
    },
    numberOfMemberBike: {
        type: Number,
        required: true
    },
    numberOfVisitorCar: {
        type: Number,
        required: true
    },
    numberOfVisitorBike: {
        type: Number,
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
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

ParkingAreasSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
ParkingAreasSchema.index({ buildingId: 1 });
ParkingAreasSchema.index({ isDeleted: 1, status: 1 });
ParkingAreasSchema.index({ createdAt: -1 });

const ParkingAreasModel = DBConnect.model('parkingareas', ParkingAreasSchema);

ParkingAreasModel.syncIndexes().then(() => {
    console.log('ParkingAreas Model Indexes Synced')
}).catch((err) => {
    console.log('ParkingAreas Model Indexes Sync Error', err)
});

export default ParkingAreasModel;