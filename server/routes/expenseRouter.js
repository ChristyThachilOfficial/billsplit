const express = require('express')
const router = express.Router();
const expenseController = require('../controller/expenseController')

router.post('/create',expenseController.createExpense);
router.get('/getexpenses/:userId', expenseController.getExpenses)
router.get('/pendingbills/:username',expenseController.getPendingBills)

module.exports = router;