const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');

router.get('/memory', botController.getMemory);

router.get('/brain', botController.getBrain);



module.exports = router;