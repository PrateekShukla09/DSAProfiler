
import express from 'express';
import { analyzeProgress } from '../controllers/geminiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/gemini/analyze-progress
router.post('/analyze-progress', protect, analyzeProgress);

export default router;
