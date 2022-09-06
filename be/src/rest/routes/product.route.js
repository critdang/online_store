const express = require('express');
// const passport = require('passport');
const productController = require('../controller/product.controller');
const { upload } = require('../../utils/uploadImg');
const auth = require('../middleware/auth');
const validate = require('../../validate/validate');

const router = express.Router();
// require('../middleware/auth').authUser(passport);

router.post('/', auth.protectingRoutes1, upload.array('images'), validate.productValidate, productController.addProduct);
router.get('/', auth.protectingRoutes1, productController.getProducts);
router.get('/:id', auth.protectingRoutes1, productController.getProduct);
router.put('/:id', auth.protectingRoutes1, productController.editProduct);
router.delete('/:id', auth.protectingRoutes1, productController.deleteProduct);
router.post('/images/:productId', auth.protectingRoutes1, upload.array('images'), productController.uploadImageProduct);
router.post('/default_image/:imgId', auth.protectingRoutes1, productController.defaultImage);
router.delete('/:productId/:imgId', auth.protectingRoutes1, productController.deleteImage);

module.exports = router;
