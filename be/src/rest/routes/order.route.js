const express = require('express');
// const passport = require('passport');
const orderController = require('../controller/order.controller');
const auth = require('../middleware/auth');

const router = express.Router();
// require('../middleware/auth').authUser(passport);

router.get('/', auth.protectingRoutes1, orderController.getOrders);
router.get('/:id', auth.protectingRoutes1, orderController.getOrder);
router.post('/change_order_status/:id', auth.protectingRoutes1, orderController.changeStatus);

module.exports = router;
