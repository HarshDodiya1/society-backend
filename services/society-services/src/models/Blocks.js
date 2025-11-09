import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const BlocksSchema = new Schema({
    blockName: {
        type: String,
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

BlocksSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
BlocksSchema.index({ buildingId: 1 });
BlocksSchema.index({ blockName: 1, buildingId: 1 }, { unique: true, sparse: true });
BlocksSchema.index({ isDeleted: 1, status: 1 });
BlocksSchema.index({ createdAt: -1 });

const BlocksModel = DBConnect.model('blocks', BlocksSchema);

BlocksModel.syncIndexes().then(() => {
    console.log('Blocks Model Indexes Synced')
}).catch((err) => {
    console.log('Blocks Model Indexes Sync Error', err)
});

export default BlocksModel;