import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const MaintenanceBillsSchema = new Schema({
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
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidDate: {
        type: Date
    },
    paymentMethod: {
        type: String
    },
    transactionId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

MaintenanceBillsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

const MaintenanceBillsModel = DBConnect.model('maintenancebills', MaintenanceBillsSchema)

MaintenanceBillsModel.syncIndexes().then(() => {
    console.log('MaintenanceBills Model Indexes Synced')
}).catch((err) => {
    console.log('MaintenanceBills Model Indexes Sync Error', err)
});

export default MaintenanceBillsModel