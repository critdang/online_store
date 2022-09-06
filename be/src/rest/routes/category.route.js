const express = require('express');
const categoryController = require('../controller/category.controller');
const validate = require('../../validate/validate');
const auth = require('../middleware/auth');
const { upload } = require('../../utils/uploadImg');

const router = express.Router();
router.post('/', auth.protectingRoutes1, upload.single('thumbnail'), validate.categoryValidate, categoryController.addCategory);
router.get('/', auth.protectingRoutes1, categoryController.getCategories);
router.get('/:id', auth.protectingRoutes1, categoryController.getCategory);
router.post('/edit_category/:id', auth.protectingRoutes1, upload.single('thumbnail'), validate.categoryValidate, categoryController.editCategory);
router.delete('/:id', auth.protectingRoutes1, categoryController.deleteCategory);

module.exports = router;
