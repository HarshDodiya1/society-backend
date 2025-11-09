import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const NoticesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    attachments: [{
        type: String
    }],
    category: {
        type: String,
        enum: ['general', 'maintenance', 'event', 'emergency', 'meeting', 'sos'],
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    blockIds: [{
        type: Schema.Types.ObjectId,
        ref: 'blocks'
    }],
    targetUserType: {
        type: String,
        enum: ['owner', 'tenant', 'all'],
        default: 'all'
    },
    unitIds: [{
        type: Schema.Types.ObjectId,
        ref: 'units'
    }],
    publishDate: {
        type: Date,
        required: true
    },
    publishNow: {
        type: Boolean,
        default: false
    },
    expiryDate: {
        type: Date
    },
    noticeStatus: {
        type: String,
        enum: ['draft', 'published', 'expired'],
        default: 'draft'
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

NoticesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
NoticesSchema.index({ buildingId: 1 });
NoticesSchema.index({ isDeleted: 1, status: 1 });
NoticesSchema.index({ createdAt: -1 });

const NoticesModel = DBConnect.model('notices', NoticesSchema);

NoticesModel.syncIndexes().then(() => {
    console.log('Notices Model Indexes Synced')
}).catch((err) => {
    console.log('Notices Model Indexes Sync Error', err)
});

export default NoticesModel;