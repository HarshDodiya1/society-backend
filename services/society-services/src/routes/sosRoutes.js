import express from 'express';
import {
  triggerSosAlert,
  deactivateSosAlert,
  getActiveSosAlerts,
  getAllSosAlerts
} from '../controllers/sosController.js';
import { authenticate, isSuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Admin routes - Protected with authentication and super admin role
router.post('/trigger', authenticate, isSuperAdmin, triggerSosAlert); // Admin: Trigger SOS alert
router.put('/:id/deactivate', authenticate, isSuperAdmin, deactivateSosAlert); // Admin: Deactivate SOS alert
router.get('/all', authenticate, isSuperAdmin, getAllSosAlerts); // Admin: Get all SOS alerts history

// Resident routes - Protected with authentication only
router.get('/active', authenticate, getActiveSosAlerts); // Resident: Get active SOS alerts

export default router;
