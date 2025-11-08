const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const BuildingsSchema = new Schema({
    buildingName: {
        type: String,
        required: true
    },
    societyName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    totalBlocks: {
        type: Number,
        required: true
    },
    totalUnits: {
        type: Number,
        required: true
    },
    buildingType: {
        type: String,
        required: true
    },
    approveBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    approveAt: {
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

BuildingsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const BuildingsModel = DBConnect.model('buildings', BuildingsSchema)

BuildingsModel.syncIndexes().then(() => {
    console.log('Buildings Model Indexes Synced')
}).catch((err) => {
    console.log('Buildings Model Indexes Sync Error', err)
})

module.exports = BuildingsModel