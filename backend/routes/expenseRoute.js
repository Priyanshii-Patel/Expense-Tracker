const express = require("express");
const router = express.Router();

const {addExpense, getExpense, deleteExpense, updateExpense, getTotalExpense} = require ('../controllers/expenseController');
const protect = require ('../middlewares/authmiddleware');


router.post('/', protect,addExpense);
router.get('/', protect, getExpense);
router.delete('/:id', protect, deleteExpense);
router.put('/:id', updateExpense)
router.get('/:id', getTotalExpense)

module.exports = router;