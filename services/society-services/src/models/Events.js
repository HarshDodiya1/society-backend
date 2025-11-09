import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { DBConnect } from './index.js';

const EventsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    banner: {
        type: String
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    blockIds: [{
        type: Schema.Types.ObjectId,
        ref: 'blocks'
    }],
    floorIds: [{
        type: Schema.Types.ObjectId,
        ref: 'floors'
    }],
    unitIds: [{
        type: Schema.Types.ObjectId,
        ref: 'units'
    }],
    targetUserTypes: [{
        type: String,
        enum: ['owner', 'tenant', 'employee']
    }],
    territory: {
        type: String
    },
    venue: {
        type: String,
        required: true
    },
    venueLocation: {
        lat: Number,
        lng: Number,
        address: String
    },
    eventDate: {
        type: Date,
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
    registrationLimit: {
        type: Number,
        default: 100 // Default limit if not specified
    },
    registrationFields: [{
        fieldName: String,
        fieldType: String, // text, email, phone, select, checkbox
        isRequired: Boolean,
        options: [String] // for select/checkbox
    }],
    registrations: [{
        type: Schema.Types.ObjectId,
        ref: 'eventregistrations'
    }],
    eventStatus: {
        type: String,
        enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
        default: 'draft'
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

EventsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
EventsSchema.index({ buildingId: 1 });
EventsSchema.index({ isDeleted: 1, eventStatus: 1 });
EventsSchema.index({ createdAt: -1 });

const EventsModel = DBConnect.model('events', EventsSchema);

EventsModel.syncIndexes().then(() => {
    console.log('Events Model Indexes Synced')
}).catch((err) => {
    console.log('Events Model Indexes Sync Error', err)
});

export default EventsModel;
