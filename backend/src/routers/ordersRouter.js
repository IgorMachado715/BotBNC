const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

//router.get("/:orderId/:clientOrderId", ordersController.getOrder);

router.get('/:symbol?', ordersController.getOrders);

router.post('/', ordersController.placeOrder);

router.delete('/:symbol/:orderId', ordersController.cancelOrder);

module.exports = router;