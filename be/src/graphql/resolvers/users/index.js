const {createUser,login,changePassword,editProfile,getUser} = require('./services');
const {listProducts,productDetail,productImage,addToCart,cartProduct} = require('./services');
const {listCategories,listCategory} =require('./services');
const {getCart,getListItemInCart,deleteItemCart} = require('./services');
const {createOrder,listAllOrders,changeOrderStatus} = require('./services');
module.exports = {
  Query:{
    user:getUser,
    listProducts,
    productImage,
    cartProduct,
    listCategories,
    listCategory,
    getCart,
    listAllOrders,
    getListItemInCart
  },
  Mutation: {
    login,
    createUser,
    changePassword,
    editProfile,
    addToCart,
    deleteItemCart,
    productDetail,
    changeOrderStatus,
    createOrder,
  }
}