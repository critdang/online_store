exports.errorName = {
  SERVER_ERROR: 'SERVER_ERROR',
  // User
  EXIST_ACCOUNT: 'Account has already been created. Try another',
  NOT_ACTIVE_ACCOUNT: 'Account has already been created. But not active yet',
  USER_NOT_FOUND: 'No found user. Try again',
  WRONG_PASS: 'Wrong password. Input again',
  WRONG_CURRENT_PASS: 'Wrong current password',
  SUCCESS_EMAIL: 'Verify your email',
  PROVIDE_ADD_TO_CART: 'Fill in quantity and productId',
};

exports.errorType = {
  SERVER_ERROR: {
    message: 'Server error.',
    statusCode: 500,
  },
  EXIST_ACCOUNT: {
    message: 'Account has already been created',
    statusCode: 400,
  },
  NOT_ACTIVE_ACCOUNT: {
    message: 'The account have been created but not active yet',
    statusCode: 400,
  },
  USER_NOT_FOUND: {
    message: 'User not found or not active yet',
    statusCode: 400,
  },
  WRONG_PASS: {
    message: 'Password is incorrect',
    statusCode: 400,
  },
  WRONG_CURRENT_PASS: {
    message: 'Wrong current password',
    statusCode: 400,
  },
};
