const Income = require('../models/income');
const Expense = require('../models/Expense');

const getDashboard = async (req, res) => {
    try {

        const user = req.user.id;

        const { month, year } = req.query;

        let dateFilter = {};

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            dateFilter = {
                date: { $gte: startDate, $lte: endDate }
            };
        }

        const income = await Income.find({ user, ...dateFilter });
        const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);

        const expense = await Expense.find({ user, ...dateFilter });
        const totalExpense = expense.reduce((acc, curr) => acc + curr.amount, 0);

        const remainingBalance = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            totalIncome,
            totalExpense,
            remainingBalance,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
};
module.exports = { getDashboard };