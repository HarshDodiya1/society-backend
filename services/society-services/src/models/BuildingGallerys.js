import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

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

BuildingGallerysModel.syncIndexes().then(() => {
    console.log('BuildingGallerys Model Indexes Synced')
}).catch((err) => {
    console.log('BuildingGallerys Model Indexes Sync Error', err)
});

export default BuildingGallerysModel