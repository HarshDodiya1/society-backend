import SosAlertsModel from '../models/SosAlerts.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Admin: Trigger SOS alert for all residents
export const triggerSosAlert = async (req, res) => {
  try {
    const { buildingId, message } = req.body;

    if (!buildingId) {
      return errorResponse(res, 'Building ID is required', 400);
    }

    // Deactivate any existing active alerts
    await SosAlertsModel.updateMany(
      { buildingId, isActive: true },
      { isActive: false, deactivatedAt: new Date() }
    );

    // Create new SOS alert
    const sosAlert = await SosAlertsModel.create({
      buildingId,
      triggeredBy: req.user?._id,
      message: message || 'Emergency SOS Alert - Please stay safe and follow emergency protocols',
      isActive: true,
      createdAt: new Date()
    });

    const populatedAlert = await SosAlertsModel.findById(sosAlert._id)
      .populate('triggeredBy', 'firstName lastName')
      .populate('buildingId', 'buildingName');

    return successResponse(res, populatedAlert, 'SOS alert triggered successfully');
  } catch (error) {
    console.error('Error triggering SOS alert:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Admin: Deactivate SOS alert
export const deactivateSosAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAlert = await SosAlertsModel.findByIdAndUpdate(
      id,
      { isActive: false, deactivatedAt: new Date() },
      { new: true }
    );

    if (!updatedAlert) {
      return errorResponse(res, 'SOS alert not found', 404);
    }

    return successResponse(res, updatedAlert, 'SOS alert deactivated successfully');
  } catch (error) {
    console.error('Error deactivating SOS alert:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Resident: Get active SOS alerts
export const getActiveSosAlerts = async (req, res) => {
  try {
    const { buildingId } = req.query;

    if (!buildingId) {
      return errorResponse(res, 'Building ID is required', 400);
    }

    const activeAlerts = await SosAlertsModel.find({
      buildingId,
      isActive: true
    })
      .populate('triggeredBy', 'firstName lastName')
      .populate('buildingId', 'buildingName')
      .sort({ createdAt: -1 })
      .limit(1); // Only get the latest active alert

    return successResponse(res, activeAlerts, 'Active SOS alerts fetched successfully');
  } catch (error) {
    console.error('Error fetching active SOS alerts:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Admin: Get all SOS alerts history
export const getAllSosAlerts = async (req, res) => {
  try {
    const { buildingId } = req.query;

    const filter = {};
    if (buildingId) {
      filter.buildingId = buildingId;
    }

    const alerts = await SosAlertsModel.find(filter)
      .populate('triggeredBy', 'firstName lastName')
      .populate('buildingId', 'buildingName')
      .sort({ createdAt: -1 });

    return successResponse(res, alerts, 'SOS alerts history fetched successfully');
  } catch (error) {
    console.error('Error fetching SOS alerts history:', error);
    return errorResponse(res, error.message, 500);
  }
};
