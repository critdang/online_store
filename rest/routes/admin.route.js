const express = require('express');
const adminController = require('../controller/admin.controller');
const { upload,uploadImg } = require('../../utils/uploadImg');
const passport = require('passport');
const router = express.Router();
require("../middleware/auth").authUser(passport)

// router.route('/uploadImage/:email').post(userController.uploadImage);
// http://localhost:3301/api/users/uploadImage/1
// router.post('/uploadImage/:id',upload.single('image'),adminController.uploadImage);
// Admin
router.post('/login',passport.authenticate('login', {failureRedirect: '/loginerror'}),adminController.login);
// router.post('/login',adminController.login);
router.get('/avatar', upload.single('avatar'),adminController.uploadAdminAvatar);
// CRUD client
router.get('/users', adminController.getUsers);
router.get('/user/:id', adminController.getUser);
router.delete('/user/:id', adminController.deleteUser);
router.post('/blockUser/:id', adminController.blockUser);
router.post('/unblockUser/:id', adminController.unblockUser);

// CRUD category
router.post('/category',upload.single('thumbnail'),adminController.addCategory);
router.get('/categories', adminController.getCategories);
router.get('/category/:id', adminController.getCategory);
router.post('/editCategory/:id', adminController.editCategory);
router.post('/editThumbnail/:id',upload.single('thumbnail'),adminController.editThumbnail);
router.delete('/category/:id', adminController.deleteCategory);

// CRUD product
router.post('/product', adminController.addProduct);
router.get('/products', adminController.getProducts);
router.get('/product/:id', adminController.getProduct);
router.put('/product/:id', adminController.editProduct);
router.delete('/product/:id', adminController.deleteProduct);

// CRUD Image in Product
router.post('/product/:productId', upload.array('images') ,adminController.uploadImageProduct);
router.delete('/product/:productId/:imgId', adminController.deleteImage);
// CRUD order
router.get('/orders', adminController.getOrders);
router.get('/order', adminController.getOrder);
router.post('/changeStauts/:id', adminController.changeStatus);


// ejs
router.get('/loginView',adminController.getLoginView);
router.get('/forgotPassword',adminController.forgotPasswordView);
module.exports = router;
