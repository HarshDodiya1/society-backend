import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const FloorsSchema = new Schema({
    floorName: {
        type: String,
        required: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'blocks',
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

FloorsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const FloorsModel = DBConnect.model('floors', FloorsSchema);

FloorsModel.syncIndexes().then(() => {
    console.log('Floors Model Indexes Synced')
}).catch((err) => {
    console.log('Floors Model Indexes Sync Error', err)
});

export default FloorsModel;