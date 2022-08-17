exports.errorName = {
  SERVER_ERROR: 'SERVER_ERROR',
  // User
  EXIST_ACCOUNT: 'EXIST_ACCOUNT',
  NOT_ACTIVE_ACCOUNT: 'NOT_ACTIVE_ACCOUNT',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  WRONG_PASS: 'WRONG_PASS',
  WRONG_CURRENT_PASS: 'WRONG_CURRENT_PASS',
  SUCCESS_EMAIL: 'Verify your email',

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
