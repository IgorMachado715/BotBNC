const express = require('express');
const router = express.Router();
const monitorsController = require('../controllers/monitorsController');

router.get('/:id', monitorsController.getMonitor);

router.get('/', monitorsController.getMonitors);

router.post('/:id/start', monitorsController.startMonitor);

router.post('/:id/stop', monitorsController.stopMonitor);

router.post('/', monitorsController.insertMonitor);

router.patch('/:id', monitorsController.updateMonitor);

router.delete('/:id', monitorsController.deleteMonitor);

module.exports = router;