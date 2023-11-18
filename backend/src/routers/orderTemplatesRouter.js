const express = require('express');
const router = express.Router();
const orderTemplatesController = require('../controllers/orderTemplatesController');

//router.get('/:id', orderTemplatesController.getOrderTemplate);

router.get('/:symbol?', orderTemplatesController.getOrderTemplates);

router.patch('/:id', orderTemplatesController.updateOrderTemplate);

router.post('/', orderTemplatesController.insertOrderTemplate);

router.delete('/:id', orderTemplatesController.deleteOrderTemplate);

module.exports = router;