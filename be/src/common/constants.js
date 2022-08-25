const ERROR = {

  // PROVIDE INPUT
  PROVIDE_EMAIL_PASS: 'Please provide email and password!',
  PROVIDE_EMAIL: 'Please provide your email !',
  EMAIL_NOT_CORRECT: 'your email is not correct',
  DISABLED: 'your account has been disabled or not active yet , please contact admin',
  PASS_NOT_CORRECT: 'your password is not correct',
  PROVIDE_PASS: 'Please provide your password',
  PROVIDE_ID: 'Provide ID user',
  FILL_OUT: 'Fill out completely',

  // Admin
  PROVIDE_ADMIN_AVA: 'upload avatar failed',

  // USER
  PASSWORD_NOT_MATCH: 'Your passwords don\'t match',
  UPLOAD_AVATAR_FAIL: 'Fail to upload avatar',
  UPDATE_AVATAR_FAIL: 'Update avatar failed',
  EXIST_ACCOUNT: 'Account has already been created',
  DELETE_FAIL: 'User not found or activated',
  WRONG_CURRENT_PASS: 'Wrong current password',
  NOT_ACTIVE_ACCOUNT: 'Account has already been created. But not active yet',
  USER_NOT_FOUND: 'No found user. Try again',
  WRONG_PASS: 'Wrong password. Input again',

  // USER - VERIFY
  NO_FOUND_USER: 'User not found',
  EMAIL_NOT_AVA: 'Email is not avaliable',
  REQUEST_RESET_FAIL: 'Fail to request',
  RESET_PASSWORD_TOKEN_EXPIRED: 'Your password reset token is either invalid or expired.',

  // Category
  PROVIDE_CATE_NAME: 'Provide category name',
  PROVIDE_CATE_DESCRIPTION: 'Provide description',
  PROVIDE_CATE: 'Provide name & description',
  EXIST_CATE: 'Category already exists',
  ERROR_IMG: 'No image uploaded',
  PROVIDE_CATE_ID: 'Please provide ID category',
  NO_FOUND_CATE: 'Category not found',
  NO_CATEGORIES: 'Categories not found',
  HAVE_PRODUCT: 'Have product in category. Can not delete',

  // PRODUCT
  PROVIDE_PRODUCT_NAME: 'Please provide product name',
  PROVIDE_PRODUCT_PRICE: 'Please provide product price',
  PROVIDE_PRODUCT_AMOUNT: 'Please provide product amount',
  NO_PRODUCT_FOUND: 'No product found',
  PROVIDE_PRODUCT_ID: 'Please provide product ID',
  NO_IMAGE_UPLOADED: ' No images uploaded',
  PROVIDE_DEFAULT_IMAGE_ID: 'Please provide default image ID',
  PROVIDE_PRODUCT_CATEGORY: 'Please chose a category for the product',
  NO_IMAGE_FOUND: 'No image found',
  PROVIDE_PRODUCTI_IMGID: 'Provide product ID and image ID',
  PRODUCT_IN_ORDER: 'Product in order.Can not deleted',
  PRODUCT_EXCEED: 'Product quantity exceed',

  // ORDER
  PROVIDE_ORDER_ID: 'Please provide order ID',
  PROVIDE_ORDER_STATUS: 'Please provide order status',
  NO_ORDER_FOUND: ' No order found',
  // ORDER-USER
  EXCEED_QUANTITY: 'Exceed quantity limit',
  ORDER_NOT_FOUND: 'Order not found',
  // CART-USER
  PRODUCT_TO_CART: 'Add product successfully to cart',
  NO_PRODUCT_IN_CART: 'No Product in cart',
  NO_FOUND_CART: 'Cart doesn\'t found ',
  NO_FOUND_PRODUCT_IN_CART: 'Can not delete product in cart because of not found in cart',
};

const RESPONSE = {
  // Admin
  LOGIN_SUCCESS: 'Login success',
  AVA_SUC: 'Upload admin avatar successfully',

  // USER
  BLOCK_SUC: 'Block user successfully!',
  DELETE_USER_SUC: 'Deleted user successfully',
  PASSWORD_UPDATE_SUCCESS: 'Your password has been updated successfully',

  // USER - verify account
  VERIFY_SUCCESS: 'Successfully verified',

  // CREATE USER
  CREATE_USER_SUCCESS: 'Create user successfully. Please check email',

  // Category
  CREATE_SUC: 'Category created successfully',
  DELETE_SUC: 'Category deleted successfully!',

  // Order
  CHANGE_STATUS_SUCC: 'Change status successfully',

  // PRODUCT
  PRODUCT_SUC: 'Add Product successfully',
  PRODUCT_UPDATE_SUC: 'Product have been updated successfully!',
  DELETE_PRODUCT_IMAGE_SUC: 'Deleted image successfully!',
  DELETE_PRODUCT_SUC: 'Deleted Product Successfully',

  // PRODUCT IMAGES
  PRODUCT_IMAGE_UPDATE_SUC: 'Product images Uploaded successfully',
  PRODUCT_IMAGE_DEFAULT_SUC: 'Update default product image',

  // CART
  DELETE_ITEM_IN_CART_SUC: 'Product deleted successfully',

};

const MESSAGE = {
  // USER - verify email
  SUCCESS_EMAIL: 'Verify your email',
  SUCCESS_EMAIL_DES: 'please click the link below to verify your email',
  SUCCESS_EMAIL_ENDPOINT: '/verify/',

};
module.exports = { ERROR, RESPONSE, MESSAGE };
