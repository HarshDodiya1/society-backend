const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const AmenitiesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    amenityType: {
        type: String,
        required: true
    },
    bookingCharge: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    bookingType: {
        type: String,
        required: true
    },
    bookingSlots: [{
        type: String
    }],
    advanceBookingDays: {
        type: Number,
        required: true
    },
    requiresApproval: {
        type: Boolean,
        default: true
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

AmenitiesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const AmenitiesModel = DBConnect.model('amenities', AmenitiesSchema)

module.exports = AmenitiesModel