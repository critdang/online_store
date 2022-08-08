// eslint-disable-next-line import/no-unresolved
const { GraphQLUpload } = require('graphql-upload');
const {
  createUser, login, changePassword, editProfile, uploadAvatar, getUser,
} = require('./services');
const {
  products, listProducts, productDetail, productImage, addToCart, cartProduct,
} = require('./services');
const { listCategories, listCategory, categories } = require('./services');
const { getCart, deleteItemCart } = require('./services');
const { createOrder, listOrders, changeOrderStatus } = require('./services');

module.exports = {
  UploadImg: GraphQLUpload,
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
    uploadAvatar,
    addToCart,
    deleteItemCart,
    changeOrderStatus,
    createOrder,
  },
};
