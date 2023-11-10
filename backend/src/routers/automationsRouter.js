const express = require('express');
const router = express.Router();
const automationsController = require('../controllers/automationsController');

router.get('/:id', automationsController.getAutomation);

router.get('/', automationsController.getAutomations);

router.post('/:id/start', automationsController.startAutomation);

router.post('/:id/stop', automationsController.stopAutomation);

router.post('/', automationsController.insertAutomation);

router.patch('/:id', automationsController.updateAutomation);

router.delete('/:id', automationsController.deleteAutomation);

module.exports = router;