const express = require('express');
const passport = require('passport');
const adminController = require('../controller/admin.controller');
const { upload } = require('../../utils/uploadImg');
const auth = require('../middleware/auth');
const validate = require('../../validate/validate');

const router = express.Router();
require('../middleware/auth').authUser(passport);

// Admin
router.post('/', validate.loginValidate, passport.authenticate('login', { failureRedirect: '/loginerror' }), adminController.login);
router.get('/dashboard', adminController.dashboard);
router.post('/avatar', auth.protectingRoutes, upload.single('avatar'), adminController.uploadAdminAvatar);
router.get('/logout', adminController.logout);

// user
router.get('/users', auth.protectingRoutes, adminController.getUsers);
router.get('/user/:id', auth.protectingRoutes, adminController.getUser);
router.delete('/user/:id', auth.protectingRoutes, adminController.deleteUser);
router.post('/block/:id', auth.protectingRoutes, adminController.changeBlockUserStt);

// category
router.post('/category', auth.protectingRoutes, upload.single('thumbnail'), validate.createCategory, adminController.addCategory);
router.get('/categories', auth.protectingRoutes, adminController.getCategories);
router.get('/category/:id', auth.protectingRoutes, adminController.getCategory);
router.post('/editCategory/:id', auth.protectingRoutes, validate.categoryValidate, adminController.editCategory);
router.post('/editThumbnail/:id', auth.protectingRoutes, upload.single('thumbnail'), adminController.editThumbnail);
router.delete('/category/:id', auth.protectingRoutes, adminController.deleteCategory);

// product
router.post('/product', auth.protectingRoutes, upload.array('images'), validate.productValidate, adminController.addProduct);
router.get('/products', auth.protectingRoutes, adminController.getProducts);
router.get('/product/:id', auth.protectingRoutes, adminController.getProduct);
router.put('/product/:id', auth.protectingRoutes, validate.productValidate, adminController.editProduct);
router.delete('/product/:id', auth.protectingRoutes, adminController.deleteProduct);

// Image in Product
router.post('/productImages/:productId', auth.protectingRoutes, upload.array('images'), adminController.uploadImageProduct);
router.post('/default_image/:imgId', auth.protectingRoutes, adminController.defaultImage);
router.delete('/product/:productId/:imgId', auth.protectingRoutes, adminController.deleteImage);

// order
router.get('/orders', auth.protectingRoutes, adminController.getOrders);
router.get('/order/:id', auth.protectingRoutes, adminController.getOrder);
router.post('/changeOrderStatus/:id', auth.protectingRoutes, adminController.changeStatus);

// ejs
router.get('/loginView', adminController.getLoginView);
router.get('/forgotPassword', adminController.forgotPasswordView);
router.get('/profile', adminController.profile);
router.get('/products', adminController.getProducts);
router.get('/error', adminController.error);
router.get('/productView', adminController.productView);
router.get('/userView', adminController.userView);
router.get('/orderView', adminController.orderView);
router.get('/categoryView', adminController.categoryView);

module.exports = router;
