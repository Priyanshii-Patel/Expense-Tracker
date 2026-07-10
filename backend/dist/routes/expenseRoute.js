const express = require("express");
const router = express.Router();

const {addExpense, getExpense, deleteExpense, updateExpense, getTotalExpense} = require ('../controllers/expenseController');
const protect = require ('../middlewares/authmiddleware');


router.post('/', protect,addExpense);
router.get('/', protect, getExpense);
router.get('/total', protect, getTotalExpense)
router.delete('/:id', protect, deleteExpense);
router.put('/:id', protect, updateExpense)

module.exports = router;
