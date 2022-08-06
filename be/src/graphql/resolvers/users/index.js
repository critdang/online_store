const {
  createUser, login, changePassword, editProfile, getUser,
} = require('./services');
const {
  products, listProducts, productDetail, productImage, addToCart, cartProduct,
} = require('./services');
const { listCategories, listCategory, categories } = require('./services');
const { getCart, deleteItemCart } = require('./services');
const { createOrder, listOrders, changeOrderStatus } = require('./services');

module.exports = {
  Query: {
    user: getUser,
    products,
    listProducts,
    productImage,
    cartProduct,
    listCategories,
    listCategory,
    getCart,
    listOrders,
    productDetail,
    categories,
  },
  Mutation: {
    login,
    createUser,
    changePassword,
    editProfile,
    addToCart,
    deleteItemCart,
    changeOrderStatus,
    createOrder,
  },
};
