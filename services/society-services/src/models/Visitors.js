const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const VisitorsSchema = new Schema({
    visitorName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    visitorImage: {
        type: String
    },
    vehicleNumber: {
        type: String
    },
    purpose: {
        type: String,
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'blocks'
    },
    floorId: {
        type: Schema.Types.ObjectId,
        ref: 'floors'
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units'
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members'
    },
    checkInTime: {
        type: Date,
        required: true
    },
    checkOutTime: {
        type: Date
    },
    approvalStatus: {
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
    isDeleted: {
        type: Boolean,
        default: false
    }
});

VisitorsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const VisitorsModel = DBConnect.model('visitors', VisitorsSchema)

module.exports = VisitorsModel