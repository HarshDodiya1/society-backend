import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const MembersSchema = new Schema({
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
    gender: {
        type: String,
        required: true
    },
    ownershipProof: {
        type: String,
        required: true
    },
    committeeType: {
        type: String
    },
    memberType: {
        type: String,
        required: true
    },
    memberRelation: {
        type: String
    },
    parentMemberId: {
        type: Schema.Types.ObjectId,
        ref: 'members'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'blocks',
        required: true
    },
    floorId: {
        type: Schema.Types.ObjectId,
        ref: 'floors',
        required: true
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units',
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    memberStatus: {
        type: String,
        default: 'pending'
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    approvedAt: {
        type: Date
    },
    rejectedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    rejectedAt: {
        type: Date
    },
    rejectionReason: {
        type: String
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

MembersSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
MembersSchema.index({ buildingId: 1 });
MembersSchema.index({ isDeleted: 1, memberStatus: 1 });
MembersSchema.index({ createdAt: -1 });

const MembersModel = DBConnect.model('members', MembersSchema);

MembersModel.syncIndexes().then(() => {
    console.log('Members Model Indexes Synced')
}).catch((err) => {
    console.log('Members Model Indexes Sync Error', err)
});

export default MembersModel;