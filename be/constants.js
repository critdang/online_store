const constants = {
  // create_notify
  FILL_OUT: 'Fill out completely',
  EXIST_ACCOUNT: 'Account has already been created',
  PROVIDE_EMAIL: 'Please provide your email',

  // verify email
  SUCCESS_EMAIL: 'Verify your email',
  SUCCESS_EMAIL_DES: 'please click the link below to verify your email',
  SUCCESS_EMAIL_ENDPOINT: '/user/verify/',

  // Login notify
  PROVIDE: 'Please provide email and password!',
  EMAIL_PROVIDE: 'Please provide email !',
  EMAIL_NOT_CORRECT: 'your email is not correct',
  DISABLED: 'your account has been disabled or not active yet , please contact admin',
  PASS_NOT_CORRECT: 'your password is not correct',
  PASSWORD_PROVIDE: 'Please provide your password',
  PROVIDE_ID: 'Provide ID user',
  // Admin
  PROVIDE_ADMIN_AVA: 'upload avatar failed',
  AVA_SUC: 'Upload admin avatar successfully',
  // Change Block Stt
  NO_USER: 'No found user',

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
  NO_IMAGE_FOUND: 'No image found',
  PROVIDE_PRODUCTI_IMGID: 'Provide product ID and image ID',
  DELETE_PRODUCT_IMAGE_SUC: 'Deleted image successfully!',
  PRODUCT_IN_ORDER: 'Product in order.Can not deleted',
  DELETE_PRODUCT_SUC: 'Deleted Product Successfully',

  // ORDER
  PROVIDE_ORDER_ID: 'Please provide order ID',
  PROVIDE_ORDER_STATUS: 'Please provide order status',
  NO_ORDER_FOUND: ' No order found',
  // verify email
  EMAIL_NOT_AVA: 'this email not available',
  TOKEN_EXPIRED: 'Your token has expired',
  SUCCESS_VERIFY: 'success. Your email has been actived',

  // Input
  PROVIDE_INPUT_EMAIL: 'invalid email. required com or net',
  PROVIDE_INPUT_FULLNAME: 'Provided fullname',
  PROVIDE_INPUT_PASSWORD: 'Provided password',
  FORM_INPUT_PASSWORD: 'invalid password , must contain at least 6 characters',

  // Update Password
  CHECK_PASS: 'please try the right old password',

  // REGIS class
  REGIS_EXISTS: 'Your registration has been already existed ',
  CLASS_FULL: 'Class is full. Please try again later',

  // Find registration
  NO_REGIS: 'does not have registration',

  // CLASS
  NO_CLASS: 'this class does not exist',

  // ADMIN
  // Create Class
  EXIST_CLASS: 'Existed class in DB',
  NO_CLASS_FOUND: 'No class found ',
  NO_DELETE: 'Class have student , can not delete',
  CLASS_CLOSE: 'the class is close, can not accept at this time',

  // EMAIL
  CONGRA: 'Congratulation',
  CONGRA_MSG: 'Congratulation , your registered class has been accepted',
  CANCEL: 'Cancel Class',
  CANCEL_MSG: 'Your registered class has been cancel because you doesn not meet the class requirements.Try again later.',
};

module.exports = constants;
