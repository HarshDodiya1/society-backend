import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const CommitteeMembersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    countryCodeName: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    committeeType: {
        type: String,
        enum: ['Chairman', 'Secretary', 'Treasurer', 'Member'],
        required: true
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members'
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
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

CommitteeMembersSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
CommitteeMembersSchema.index({ buildingId: 1 });
CommitteeMembersSchema.index({ isDeleted: 1, status: 1 });
CommitteeMembersSchema.index({ createdAt: -1 });

const CommitteeMembersModel = DBConnect.model('committeemembers', CommitteeMembersSchema);

CommitteeMembersModel.syncIndexes().then(() => {
    console.log('CommitteeMembers Model Indexes Synced')
}).catch((err) => {
    console.log('CommitteeMembers Model Indexes Sync Error', err)
});

export default CommitteeMembersModel;
