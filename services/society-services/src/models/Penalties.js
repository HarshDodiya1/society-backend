import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const PenaltiesSchema = new Schema({
    penaltyNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    photos: {
        type: String
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units',
        required: true
    },
    penaltyDate: {
        type: Date,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    penaltyStatus: {
        type: String,
        default: 'pending'
    },
    receiverDate: {
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

PenaltiesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const PenaltiesModel = DBConnect.model('penalties', PenaltiesSchema)

PenaltiesModel.syncIndexes().then(() => {
    console.log('Penalties Model Indexes Synced')
}).catch((err) => {
    console.log('Penalties Model Indexes Sync Error', err)
});

export default PenaltiesModel