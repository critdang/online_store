const express = require('express');
const passport = require('passport');
const productController = require('../controller/product.controller');
const { upload } = require('../../utils/uploadImg');
const auth = require('../middleware/auth');
const validate = require('../../validate/validate');

const router = express.Router();
require('../middleware/auth').authUser(passport);

router.post('/', auth.protectingRoutes, upload.array('images'), validate.productValidate, productController.addProduct);
router.get('/', auth.protectingRoutes, productController.getProducts);
router.get('/:id', auth.protectingRoutes, productController.getProduct);
router.put('/:id', auth.protectingRoutes, productController.editProduct);
router.delete('/:id', auth.protectingRoutes, productController.deleteProduct);
router.post('/images/:productId', auth.protectingRoutes, upload.array('images'), productController.uploadImageProduct);
router.post('/default_image/:imgId', auth.protectingRoutes, productController.defaultImage);
router.delete('/:productId/:imgId', auth.protectingRoutes, productController.deleteImage);

module.exports = router;
