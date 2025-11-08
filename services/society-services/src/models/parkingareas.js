const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const ParkingAreasSchema = new Schema({
    parkingName: {
        type: String,
        required: true
    },
    numberOfMemberCar: {
        type: Number,
        required: true
    },
    numberOfMemberBike: {
        type: Number,
        required: true
    },
    numberOfVisitorCar: {
        type: Number,
        required: true
    },
    numberOfVisitorBike: {
        type: Number,
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

ParkingAreasSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const ParkingAreasModel = DBConnect.model('parkingareas', ParkingAreasSchema)

ParkingAreasModel.syncIndexes().then(() => {
    console.log('Parking Areas Model Indexes Synced')
}).catch((err) => {
    console.log('Parking Areas Model Indexes Sync Error', err)
})

module.exports = ParkingAreasModel