const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const MaintenanceBillsSchema = new Schema({
    maintenanceTypeId: {
        type: Schema.Types.ObjectId,
        ref: 'maintenancetypes',
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
    dueDate: {
        type: Date,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalOwnerAmount: {
        type: String,
        required: true
    },
    totalTenantAmount: {
        type: String,
        required: true
    },
    lateFeeEnabled: {
        type: Boolean,
        default: false
    },
    lateFeeType: {
        type: String
    },
    lateFeeAmount: {
        type: String
    },
    description: {
        type: String
    },
    published: {
        type: Boolean,
        default: false
    },
    billStatus: {
        type: String,
        default: 'draft'
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

MaintenanceBillsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const MaintenanceBillsModel = DBConnect.model('maintenancebills', MaintenanceBillsSchema)

MaintenanceBillsModel.syncIndexes().then(() => {
    console.log('Maintenance Bills Model Indexes Synced')
}).catch((err) => {
    console.log('Maintenance Bills Model Indexes Sync Error', err)
})

module.exports = MaintenanceBillsModel