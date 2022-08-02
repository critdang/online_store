const {
  createUser, login, changePassword, editProfile, getUser,
} = require('./services');
const {
  products, listProducts, productDetail, productImage, addToCart, cartProduct,
} = require('./services');
const { listCategories, listCategory } = require('./services');
const { getCart, getListItemInCart, deleteItemCart } = require('./services');
const { createOrder, listAllOrders, changeOrderStatus } = require('./services');

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
    listAllOrders,
    productDetail,
    getListItemInCart,
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
