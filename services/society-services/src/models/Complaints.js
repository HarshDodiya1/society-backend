import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const ComplaintsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    complaintType: {
        type: String,
        enum: ['common', 'unit'],
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units'
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members',
        required: true
    },
    assignedToEmployeeId: {
        type: Schema.Types.ObjectId,
        ref: 'buildingemployees'
    },
    complaintStatus: {
        type: String,
        enum: ['open', 'in-process', 'on-hold', 'close', 're-open', 'dismiss'],
        default: 'open'
    },
    followUps: [{
        remarks: String,
        nextFollowUpDate: Date,
        sendEmailNotification: Boolean,
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    resolvedDate: {
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

ComplaintsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const ComplaintsModel = DBConnect.model('complaints', ComplaintsSchema);

ComplaintsModel.syncIndexes().then(() => {
    console.log('Complaints Model Indexes Synced')
}).catch((err) => {
    console.log('Complaints Model Indexes Sync Error', err)
});

export default ComplaintsModel;