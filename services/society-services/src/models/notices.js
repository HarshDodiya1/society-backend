const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const NoticesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    priority: {
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
    publishDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
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

NoticesSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const NoticesModel = DBConnect.model('notices', NoticesSchema)

module.exports = NoticesModel