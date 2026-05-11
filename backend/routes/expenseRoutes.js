import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js'

const router = express.Router()

router.get('/', protect, getExpenses)
router.post('/', protect, addExpense)
router.put('/:id', protect, updateExpense)
router.delete('/:id', protect, deleteExpense)

export default router