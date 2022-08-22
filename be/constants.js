const constants = {
  // verify email
  SUCCESS_EMAIL: 'Verify your email',
  SUCCESS_EMAIL_DES: 'please click the link below to verify your email',
  SUCCESS_EMAIL_ENDPOINT: '/verify/',

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
  AVA_SUC: 'Upload admin avatar successfully',

  // USER
  PASSWORD_NOT_MATCH: 'Your passwords don\'t match',
  PASSWORD_UPDATE_SUCCESS: 'Your password has been updated successfully',
  UPLOAD_AVATAR_FAIL: 'Fail to upload avatar',
  UPDATE_AVATAR_FAIL: 'Update avatar failed',
  EXIST_ACCOUNT: 'Account has already been created',
  CREATE_USER_SUCCESS: 'Create user successfully. Please check email',
  // USER - VERIFY
  NO_FOUND_USER: 'User not found',
  EMAIL_NOT_AVA: 'Email is not avaliable',
  VERIFY_SUCCESS: 'Successfully verified',
  REQUEST_RESET_FAIL: 'Fail to request',
  RESET_PASSWORD_TOKEN_EXPIRED: 'Your password reset token is either invalid or expired.',

  // Category
  PROVIDE_CATE_NAME: 'Provide category name',
  PROVIDE_CATE_DESCRIPTION: 'Provide description',
  EXIST_CATE: 'Category already exists',
  ERROR_IMG: 'No image uploaded',
  CREATE_SUC: 'Category created successfully',
  PROVIDE_CATE_ID: 'Please provide ID category',
  NO_FOUND_CATE: 'Category not found',
  NO_CATEGORIES: 'Categories not found',
  HAVE_PRODUCT: 'Have product in category. Can not delete',
  DELETE_SUC: 'Category deleted successfully!',

  // PRODUCT
  PROVIDE_PRODUCT_NAME: 'Please provide product name',
  PROVIDE_PRODUCT_PRICE: 'Please provide product price',
  PROVIDE_PRODUCT_AMOUNT: 'Please provide product amount',
  PRODUCT_SUC: 'Add Product successfully',
  NO_PRODUCT_FOUND: 'No product found',
  PROVIDE_PRODUCT_ID: 'Please provide product ID',
  NO_IMAGE_UPLOADED: ' No images uploaded',
  PROVIDE_DEFAULT_IMAGE_ID: 'Please provide default image ID',
  PROVIDE_PRODUCT_CATEGORY: 'Please chose a category for the product',
  NO_IMAGE_FOUND: 'No image found',
  PROVIDE_PRODUCTI_IMGID: 'Provide product ID and image ID',
  DELETE_PRODUCT_IMAGE_SUC: 'Deleted image successfully!',
  PRODUCT_IN_ORDER: 'Product in order.Can not deleted',
  DELETE_PRODUCT_SUC: 'Deleted Product Successfully',
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
  DELETE_SUCCESS: 'Product deleted successfully',

};

module.exports = constants;
