const { GraphQLUpload } = require('graphql-upload');

const {
  filterProductByCategory, productImage, productDetail, listProducts, products,
} = require('./product');

const {
  listCategories, listCategory, categories,
} = require('./category');

const {
  createUser, verify, login, changePassword, requestReset, resetPassword, editProfile, uploadAvatar, getUser,
} = require('./user');

const {
  addToCart, cartProduct, getCart, deleteItemCart,
} = require('./cart');

const {
  createOrder, listOrders, changeOrderStatus,
} = require('./order');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    user: getUser,
    products,
    listProducts,
    productImage,
    cartProduct,
    listCategories,
    filterProductByCategory,
    listCategory,
    getCart,
    listOrders,
    productDetail,
    categories,
  },
  Mutation: {
    login,
    createUser,
    verify,
    changePassword,
    requestReset,
    resetPassword,
    editProfile,
    uploadAvatar,
    addToCart,
    deleteItemCart,
    changeOrderStatus,
    createOrder,
  },
};

module.exports = resolvers;
