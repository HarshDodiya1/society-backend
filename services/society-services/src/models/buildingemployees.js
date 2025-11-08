const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

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
    employeeType: {
        type: String,
        required: true
    },
    idProof: {
        type: String,
        required: true
    },
    policeVerificationProof: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
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

BuildingEmployeesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const BuildingEmployeesModel = DBConnect.model('buildingemployees', BuildingEmployeesSchema)

BuildingEmployeesModel.syncIndexes().then(() => {
    console.log('Building Employees Model Indexes Synced')
}).catch((err) => {
    console.log('Building Employees Model Indexes Sync Error', err)
})

module.exports = BuildingEmployeesModel