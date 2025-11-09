import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const BuildingEmployeesSchema = new Schema({
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
        enum: ['male', 'female', 'other']
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    dateOfBirth: {
        type: Date
    },
    employeeType: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        enum: ['society', 'agency'],
        required: true,
        default: 'society'
    },
    // Agency details - only if employmentType is 'agency'
    agencyDetails: {
        agencyName: String,
        agencyManagerName: String,
        agencyManagerContact: String,
        contractStartDate: Date,
        contractEndDate: Date,
        agencyAddress: String
    },
    // ID Proofs
    idProofType: {
        type: String,
        enum: ['aadhar', 'pan', 'driving_license', 'voter_id']
    },
    idProofNumber: {
        type: String
    },
    idProofDocument: {
        type: String
    },
    policeVerificationDocument: {
        type: String
    },
    // Work Schedule
    shiftTimings: {
        startTime: String,
        endTime: String
    },
    workingDays: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    joiningDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
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

BuildingEmployeesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const BuildingEmployeesModel = DBConnect.model('buildingemployees', BuildingEmployeesSchema);

BuildingEmployeesModel.syncIndexes().then(() => {
    console.log('BuildingEmployees Model Indexes Synced')
}).catch((err) => {
    console.log('BuildingEmployees Model Indexes Sync Error', err)
});

export default BuildingEmployeesModel;