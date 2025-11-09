import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const UnitsSchema = new Schema({
    unitNumber: {
        type: String,
        required: true
    },
    unitType: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    floorId: {
        type: Schema.Types.ObjectId,
        ref: 'floors',
        required: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'blocks',
        required: true
    },
    allocatedTo: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    unitStatus: {
        type: String,
        enum: ['Vacant', 'Occupied', 'Under Maintenance'],
        default: 'Vacant'
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

UnitsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const UnitsModel = DBConnect.model('units', UnitsSchema);

UnitsModel.syncIndexes().then(() => {
    console.log('Units Model Indexes Synced')
}).catch((err) => {
    console.log('Units Model Indexes Sync Error', err)
});

export default UnitsModel;