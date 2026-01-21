import express from 'express';
import { getSheetsList, getSheetContent, getStudentProgress, updateProgress, getAllStudentsProgress } from '../controllers/sheetController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSheetsList);
router.get('/:sheetName', protect, getSheetContent);
router.get('/:sheetName/progress', protect, getStudentProgress);
router.post('/update-progress', protect, updateProgress);

// Admin route
router.get('/admin/progress/:sheetName', protect, admin, getAllStudentsProgress);

export default router;
