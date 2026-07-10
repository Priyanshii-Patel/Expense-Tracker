const express = require("express");
const router = express.Router();

const { setBudget, getBudget, updateBudget, getBudgetStatus, deleteBudget } = require('../controllers/budgetControllers');
const authMiddleware = require('../middlewares/authmiddleware');


router.post('/set-budget', authMiddleware, setBudget)
router.get('/get-budget', authMiddleware, getBudget)
router.put('/update-budget/:id', authMiddleware, updateBudget)
router.get('/budget-status', authMiddleware, getBudgetStatus)
router.delete('/:id', authMiddleware, deleteBudget);

module.exports = router;