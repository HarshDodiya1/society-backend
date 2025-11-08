const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const BuildingGallerysSchema = new Schema({
    galleryFiles: [{
        type: String
    }],
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'blocks'
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

BuildingGallerysSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const BuildingGallerysModel = DBConnect.model('buildinggallerys', BuildingGallerysSchema)

module.exports = BuildingGallerysModel