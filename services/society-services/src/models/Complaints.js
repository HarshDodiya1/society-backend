const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DBConnect } = require('../models/index.js')

const ComplaintsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    photosName: {
        type: String
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units',
        required: true
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members',
        required: true
    },
    buildingEmployeeId: {
        type: Schema.Types.ObjectId,
        ref: 'buildingemployees'
    },
    complaintStatus: {
        type: String,
        default: 'open'
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

ComplaintsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const ComplaintsModel = DBConnect.model('complaints', ComplaintsSchema)

module.exports = ComplaintsModel