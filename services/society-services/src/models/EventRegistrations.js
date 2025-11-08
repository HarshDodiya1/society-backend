import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const EventRegistrationsSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'events',
        required: true
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'members',
        required: true
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units',
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    registrationData: {
        type: Map,
        of: String // Dynamic form data
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    attendance: {
        checkInTime: Date,
        checkOutTime: Date,
        status: {
            type: String,
            enum: ['registered', 'attended', 'absent'],
            default: 'registered'
        }
    },
    qrCode: {
        type: String
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

EventRegistrationsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const EventRegistrationsModel = DBConnect.model('eventregistrations', EventRegistrationsSchema);

export default EventRegistrationsModel;
