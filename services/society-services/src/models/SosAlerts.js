import mongoose from 'mongoose';
const { Schema } = mongoose;
import { DBConnect } from './index.js';

const SosAlertsSchema = new Schema({
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: 'buildings',
    required: true
  },
  triggeredBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  message: {
    type: String,
    default: 'Emergency SOS Alert - Please stay safe and follow emergency protocols'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deactivatedAt: {
    type: Date,
    default: null
  }
});

SosAlertsSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

// Indexes
SosAlertsSchema.index({ buildingId: 1 });
SosAlertsSchema.index({ isActive: 1 });
SosAlertsSchema.index({ createdAt: -1 });

const SosAlertsModel = DBConnect.model('sosalerts', SosAlertsSchema);

SosAlertsModel.syncIndexes().then(() => {
  console.log('SosAlerts Model Indexes Synced');
}).catch((err) => {
  console.log('SosAlerts Model Indexes Sync Error', err);
});

export default SosAlertsModel;
