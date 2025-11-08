const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const ParkingSpotsSchema = new Schema({
    parkingAreaId: {
        type: Schema.Types.ObjectId,
        ref: 'parkingareas',
        required: true
    },
    parkingNumber: {
        type: String,
        required: true
    },
    parkingType: {
        type: String,
        required: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'blocks'
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

ParkingSpotsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const ParkingSpotsModel = DBConnect.model('parkingspots', ParkingSpotsSchema)

module.exports = ParkingSpotsModel