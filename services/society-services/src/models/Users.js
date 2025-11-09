import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const UsersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
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
    isbuildingMember: {
        type: Boolean,
        default: false
    },
    isbuildingEmployee: {
        type: Boolean,
        default: false
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

UsersSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
UsersSchema.index({ isDeleted: 1, status: 1 });
UsersSchema.index({ createdAt: -1 });
UsersSchema.index({ email: 1 }, { unique: true, sparse: true });

const UsersModel = DBConnect.model('users', UsersSchema);

UsersModel.syncIndexes().then(() => {
    console.log('Users Model Indexes Synced')
}).catch((err) => {
    console.log('Users Model Indexes Sync Error', err)
});

export default UsersModel;