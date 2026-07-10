const Budget = require("../models/Budget");
const Expense = require("../models/Expense");


const setBudget = async (req, res) => {
  try {
    const { month, year, limitAmount } = req.body;
    const user = req.user.id;

    const existingBudget = await Budget.findOne({ user, month, year });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: "Budget already exists for this month",
      });
    }

    const budget = await Budget.create({
      user,
      month,
      year,
      limitAmount,
    });

    res.status(201).json({
      success: true,
      message: "Budget Created",
      budget,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getBudget = async (req, res) => {
  try { 
    const { month, year } = req.query;
    const user = req.user.id;

    const budget = await Budget.findOne({ user, month, year });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "No Budget Found",
      });
    }

    res.status(200).json({
      success: true,
      budget,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { limitAmount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { limitAmount },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget Updated",
      budget,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget Deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getBudgetStatus = async (req, res) => {
  try {
    const { month, year } = req.query;
    const user = req.user.id;

    const budget = await Budget.findOne({ user, month, year });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "No Budget Found",
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await Expense.find({
      user,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalExpense = expenses.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    const remaining = budget.limitAmount - totalExpense;

    res.status(200).json({
      success: true,
      budget: budget.limitAmount,
      expense: totalExpense,
      remaining,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = { setBudget, getBudget, updateBudget, deleteBudget, getBudgetStatus };

//Updated by Priynashi
