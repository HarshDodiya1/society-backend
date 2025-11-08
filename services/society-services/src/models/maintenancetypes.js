const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const MaintenanceTypesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
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

MaintenanceTypesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const MaintenanceTypesModel = DBConnect.model('maintenancetypes', MaintenanceTypesSchema)

MaintenanceTypesModel.syncIndexes().then(() => {
    console.log('Maintenance Types Model Indexes Synced')
}).catch((err) => {
    console.log('Maintenance Types Model Indexes Sync Error', err)
})

module.exports = MaintenanceTypesModel