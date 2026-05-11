import Expense from '../models/Expense.js'

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
    res.json(expenses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body
    if (!amount || !description || !category) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const newExpense = new Expense({
      amount,
      description,
      category,
      user: req.user._id
    })
    const savedExpense = await newExpense.save()
    res.status(201).json(savedExpense)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    await Expense.findByIdAndDelete(req.params.id)
    res.json({ message: 'Expense deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}