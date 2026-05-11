import express from 'express';
import protect from '../middleware/authMiddleware.js';

import { addBudget, getBudgets, updateBudget, deleteBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', protect, getBudgets);
router.post('/', protect, addBudget);
router.put('/:id', protect, updateBudget);
router.delete('/:id', protect, deleteBudget);

export default router;