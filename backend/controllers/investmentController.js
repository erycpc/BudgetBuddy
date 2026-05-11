import Investment from '../models/Investment.js';

// Create a new investment
export const addInvestment = async (req, res) => {
  try {
    const { name, type, amountInvested, currentValue } = req.body;
    if (!name || !type || !amountInvested) {
      return res.status(400).json({ message: 'Name, type, and amount invested are required' });
    }
    const newInvestment = new Investment({
      name,
      type,
      amountInvested,
      currentValue,
      user: req.user._id, // Associate investment with the authenticated user
    });
    const savedInvestment = await newInvestment.save();
    res.status(201).json(savedInvestment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating investment', error });
  }
};

// Get all investments
export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching investments', error });
  }
};

// Get a single investment by ID
export const getInvestmentById = async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, user: req.user._id });
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    res.status(200).json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching investment', error });
  }
};

// Update an investment
export const updateInvestment = async (req, res) => {
  try {
    const { name, type, amountInvested, currentValue } = req.body;
    const updatedInvestment = await Investment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, type, amountInvested, currentValue },
      { new: true }
    );
    if (!updatedInvestment) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    res.status(200).json(updatedInvestment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating investment', error });
  }
};

// Delete an investment
export const deleteInvestment = async (req, res) => {
  try {
    const deletedInvestment = await Investment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedInvestment) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    res.status(200).json({ message: 'Investment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting investment', error });
  }
};