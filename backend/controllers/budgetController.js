import Budget from '../models/Budget.js';

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body
    if (!category || !limit || !month || !year) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const newBudget = new Budget({
        category,
        limit,
        month,
        year,
        user: req.user._id
    })
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const updated = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
