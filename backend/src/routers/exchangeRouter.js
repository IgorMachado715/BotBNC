const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

router.get('/balance', exchangeController.getBalance);

module.exports = router;