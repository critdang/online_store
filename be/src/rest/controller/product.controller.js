const productService = require('../services/product.service');
const helperFn = require('../../utils/helperFn');
const { RESPONSE } = require('../../common/constants');

const addProduct = async (req, res, next) => {
  try {
    await productService.addProduct(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.PRODUCT_SUC);
  } catch (err) {
    console.log(err);
  }
};
const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    helperFn.returnSuccess(req, res, products);
  } catch (err) {
    console.log(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProduct(req, res);
    helperFn.returnSuccess(req, res, product);
  } catch (err) {
    console.log(err);
  }
};

const editProduct = async (req, res, next) => {
  try {
    await productService.editProduct(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.PRODUCT_UPDATE_SUC);
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.DELETE_PRODUCT_SUC);
  } catch (err) {
    console.log(err);
  }
};

// upload image product
const uploadImageProduct = async (req, res, next) => {
  try {
    await productService.uploadImageProduct(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.PRODUCT_IMAGE_UPDATE_SUC);
  } catch (err) {
    console.log(err);
  }
};

const defaultImage = async (req, res, next) => {
  try {
    await productService.defaultImage(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.PRODUCT_IMAGE_DEFAULT_SUC);
  } catch (err) {
    console.log(err);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    await productService.deleteImage(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.DELETE_IMAGE_SUC);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
  uploadImageProduct,
  defaultImage,
  deleteImage,
};
