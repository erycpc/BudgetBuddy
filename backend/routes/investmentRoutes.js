import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { addInvestment, getInvestments, getInvestmentById, updateInvestment, deleteInvestment } from '../controllers/investmentController.js';

const router = express.Router();

// Create a new investment
router.post('/', protect, addInvestment);

// Get all investments
router.get('/', protect, getInvestments);

// Get a single investment by ID
router.get('/:id', protect, getInvestmentById);

// Update an investment
router.put('/:id', protect, updateInvestment);

// Delete an investment
router.delete('/:id', protect, deleteInvestment);

export default router;