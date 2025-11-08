import express from 'express';
import {
    getResidentNotices,
    getNoticeById,
    markNoticeAsRead
} from '../controllers/residentNoticesController.js';

const router = express.Router();

// GET /api/resident/notices?unitId=xxx
router.get('/', getResidentNotices);

// GET /api/resident/notices/:id
router.get('/:id', getNoticeById);

// POST /api/resident/notices/:id/mark-read
router.post('/:id/mark-read', markNoticeAsRead);

export default router;
