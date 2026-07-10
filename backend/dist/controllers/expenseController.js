const Expense = require("../models/Expense")

const addExpense = async (req, res) => {
    try {

        const { amount, category, description, date } = req.body;

        if (!amount || !category) {
            return res.status(400).json({
                success: false,
                msg: "Amount & Category required"
            });
        }

        const expense = await Expense.create({
            user: req.user.id,
            amount,
            category,
            description,
            date
        });

        res.status(201).json({
            success: true,
            expense
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};


const getExpense = async (req, res) => {
    try {

        const expenses = await Expense.find({
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            expenses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};


const deleteExpense = async (req, res) => {
    try {

        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                msg: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Expense Deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};


const updateExpense = async (req, res) => {
    try {

        const { id } = req.params;
        const { amount, category, description, date } = req.body;

        const expense = await Expense.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { amount, category, description, date },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                msg: "Expense not Found"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Expense Updated Successfully",
            expense
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};


const getTotalExpense = async (req, res) => {
    try {

        const expense = await Expense.find({
            user: req.user.id
        });

        console.log("Expense Found:", expense);

        const totalExpense = expense.reduce((acc, item) => {
            return acc + Number(item.amount);
        }, 0);

        res.status(200).json({
            success: true,
            totalExpense
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};

module.exports = { addExpense, getExpense, deleteExpense, updateExpense, getTotalExpense };
