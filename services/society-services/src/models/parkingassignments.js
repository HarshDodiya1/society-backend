const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const ParkingAssignmentsSchema = new Schema({
    parkingSpotId: {
        type: Schema.Types.ObjectId,
        ref: 'parkingspots',
        required: true
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        ref: 'vehicles',
        required: true
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members',
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    assignmentStatus: {
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
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

ParkingAssignmentsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const ParkingAssignmentsModel = DBConnect.model('parkingassignments', ParkingAssignmentsSchema)

ParkingAssignmentsModel.syncIndexes().then(() => {
    console.log('Parking Assignments Model Indexes Synced')
}).catch((err) => {
    console.log('Parking Assignments Model Indexes Sync Error', err)
})

module.exports = ParkingAssignmentsModel