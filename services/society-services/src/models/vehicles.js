const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const VehiclesSchema = new Schema({
    vehicleImage: {
        type: String
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    rcBookImage: {
        type: String
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

VehiclesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const VehiclesModel = DBConnect.model('vehicles', VehiclesSchema)

VehiclesModel.syncIndexes().then(() => {
    console.log('Vehicles Model Indexes Synced')
}).catch((err) => {
    console.log('Vehicles Model Indexes Sync Error', err)
})

module.exports = VehiclesModel