import express from 'express';
import protect from '../middleware/authMiddleware.js';

import { addGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goalController.js';

const router = express.Router();

router.route('/').get(protect, getGoals).post(protect, addGoal);
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal);

export default router;