import Goal from '../models/Goal.js';

// Create a new goal
export const addGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, deadline } = req.body;
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ message: 'Title, target amount, and deadline are required' });
    }
    const newGoal = new Goal({
      title,
      targetAmount,
      savedAmount,
      deadline,
      user: req.user._id, // Associate goal with the authenticated user
    });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error });
  }
};

// Get all goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};

// Get a single goal by ID
export const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal', error });
  }
};

// Update a goal
export const updateGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, deadline } = req.body;
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, targetAmount, savedAmount, deadline },
      { new: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error });
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error });
  }
};