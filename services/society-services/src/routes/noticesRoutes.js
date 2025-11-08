import express from 'express';
import {
    createNotice,
    getNotices,
    getNoticeById,
    updateNotice,
    publishNotice,
    deleteNotice
} from '../controllers/noticesController.js';

const router = express.Router();

router.post('/', createNotice);
router.get('/', getNotices);
router.get('/:id', getNoticeById);
router.put('/:id', updateNotice);
router.put('/:id/publish', publishNotice);
router.delete('/:id', deleteNotice);

export default router;
