const express = require('express');
const passport = require('passport');
const adminController = require('../controller/admin.controller');
const { upload, uploadImg } = require('../../utils/uploadImg');
const auth = require('../middleware/auth')
const router = express.Router();
require('../middleware/auth').authUser(passport);


// Admin
router.post('/',passport.authenticate('login', {failureRedirect: '/loginerror'}),adminController.login);
router.get('/dashboard', passport.authenticate('login', { failureRedirect: '/loginerror' }), adminController.dashboard);
router.post('/avatar', upload.single('avatar'), adminController.uploadAdminAvatar);
// CRUD user
router.get('/users',auth.protectingRoutes, adminController.getUsers);
router.get('/user/:id', adminController.getUser);
router.delete('/user/:id', adminController.deleteUser);
router.post('/block/:id', adminController.changeBlockUserStt);

// CRUD category
router.post('/category', upload.single('thumbnail'), adminController.addCategory);
router.get('/categories', adminController.getCategories);
router.get('/category/:id', adminController.getCategory);
router.post('/edit_category/:id', adminController.editCategory);
router.post('/edit_thumbnail/:id', upload.single('thumbnail'), adminController.editThumbnail);
router.delete('/category/:id', adminController.deleteCategory);

// CRUD product
router.post('/product', upload.array('images'), adminController.addProduct);
router.get('/products', adminController.getProducts);
router.get('/product/:id', adminController.getProduct);
router.put('/product/:id', adminController.editProduct);
router.delete('/product/:id', adminController.deleteProduct);

// CRUD Image in Product
router.post('/product_images/:productId', upload.array('images'), adminController.uploadImageProduct);
router.post('/default_image/:imgId', adminController.defaultImage);
router.delete('/product/:productId/:imgId', adminController.deleteImage);
// CRUD order
router.get('/orders', adminController.getOrders);
router.get('/order/:id', adminController.getOrder);
router.post('/changeStatus/:id', adminController.changeStatus);

// ejs
router.get('/loginView', adminController.getLoginView);
router.get('/forgotPassword', adminController.forgotPasswordView);
router.get('/profile', adminController.profile);
router.get('/products', adminController.getProducts);

module.exports = router;
