const categoryService = require('../services/category.service');
const helperFn = require('../../utils/helperFn');
const { ERROR, RESPONSE } = require('../../common/constants');

const addCategory = async (req, res, next) => {
  try {
    if (!req.body) helperFn.returnError(req, res, ERROR.PROVIDE_CATE);

    await categoryService.addCategory(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.CREATE_SUC);
  } catch (err) {
    console.log(err);
    helperFn.returnError(res, err.message);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    helperFn.returnSuccess(req, res, categories);
  } catch (err) {
    console.log(err);
    helperFn.returnError(res, err.message);
  }
};
const getCategory = async (req, res, next) => {
  try {
    const foundCategory = await categoryService.getCategory(req, res);
    helperFn.returnSuccess(req, res, foundCategory);
  } catch (err) {
    console.log(err);
    helperFn.returnError(res, err.message);
  }
};

const editCategory = async (req, res, next) => {
  try {
    const updateCategory = await categoryService.editCategory(req, res);
    helperFn.returnSuccess(req, res, updateCategory);
  } catch (err) {
    console.log(err);
    helperFn.returnError(res, err.message);
  }
};

const editThumbnail = async (req, res) => {
  try {
    const updateThumnail = await categoryService.editThumbnail(req, res);
    helperFn.returnSuccess(req, res, updateThumnail);
  } catch (err) {
    console.log(err);
    helperFn.returnError(res, err.message);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const data = await categoryService.deleteCategory(req, res);
    if (data) {
      return helperFn.returnSuccess(req, res, RESPONSE.DELETE_SUC);
    }
  } catch (err) {
    console.log(err);
    helperFn.returnError(res, err.message);
  }
};

module.exports = {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  editThumbnail,
  deleteCategory,
};
