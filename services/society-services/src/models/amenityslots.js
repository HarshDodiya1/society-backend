const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const AmenitySlotsSchema = new Schema({
    amenityId: {
        type: Schema.Types.ObjectId,
        ref: 'amenities',
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'available'
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

AmenitySlotsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const AmenitySlotsModel = DBConnect.model('amenityslots', AmenitySlotsSchema)

AmenitySlotsModel.syncIndexes().then(() => {
    console.log('Amenity Slots Model Indexes Synced')
}).catch((err) => {
    console.log('Amenity Slots Model Indexes Sync Error', err)
})

module.exports = AmenitySlotsModel