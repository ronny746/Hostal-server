const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/create', transactionController.createTransaction);
router.get('/getall', transactionController.getAllTransactions);
router.get('/getbyid/:id', transactionController.getTransactionById);
router.put('/updatebyid/:id', transactionController.updateTransaction);
router.delete('/deletebyid/:id', transactionController.deleteTransaction);

module.exports = router;
