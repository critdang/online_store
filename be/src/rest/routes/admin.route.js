const express = require('express');
const passport = require('passport');
const adminController = require('../controller/admin.controller');

const router = express.Router();
require('../middleware/auth').authUser(passport);

// ejs
router.get('/loginView', adminController.getLoginView);
router.get('/dashboard', adminController.dashboard);
router.get('/logout', adminController.logout);
router.get('/forgotPassword', adminController.forgotPasswordView);
router.get('/profile', adminController.profile);
router.get('/products', adminController.getProducts);
router.get('/error', adminController.error);
router.get('/productView', adminController.productView);
router.get('/userView', adminController.userView);
router.get('/orderView', adminController.orderView);
router.get('/categoryView', adminController.categoryView);

module.exports = router;
